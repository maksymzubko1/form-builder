import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/api/auth/[...nextauth]/options';
import { AIRequest } from '@/types/ai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url);
    const formId = url.searchParams.get('formId') || undefined;

    const aiChat = await prisma.aiChatSession.findFirst({
      where: {
        formId,
        userId: session.user.id,
      },
    });

    if (!aiChat && formId) {
      await prisma.aiChatSession.create({
        data: {
          formId,
          userId: session.user.id,
          messages: [],
        },
      });
    }

    const messages = aiChat?.messages || [];

    return NextResponse.json({ messages });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unhandled error';
    console.log('[API][AI][GET]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    const parse = AIRequest.safeParse(body);

    if (!parse.success) {
      return NextResponse.json({ error: parse.error.issues[0].message }, { status: 400 });
    }

    const {
      prompt,
      formId,
      context: { context, selectedFields },
    } = body;

    const aiChat = await prisma.aiChatSession.findFirst({
      where: {
        formId,
        userId: session.user.id,
      },
    });

    const prevMessages =
      (aiChat?.messages as {
        role: 'user' | 'assistant';
        content: string;
      }[]) || [];
    const messages = [...prevMessages, { role: 'user' as 'user' | 'assistant', content: prompt }];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-nano',
      messages: [
        {
          role: 'system',
          content: `
You are an AI assistant for a web-based form builder. You help users generate, update, or delete form components (fields, sections, etc.) by returning clear JSON instructions.

VERY IMPORTANT RULES:
- Strict action policy: Unless the user clearly requests a change (such as using explicit instructions like: change, edit, add, delete, remove, redesign, redo, make, update, create, modify, expand, shorten, etc.), you must only provide recommendations or feedback. In these cases, respond only with an array containing a single message object: [{ "message": "Your suggestion or feedback." }] Never return any "add", "update", or "delete" actions unless explicitly requested.
- Full redesign is allowed only by explicit request: If the user asks you to fully redesign or redo the form, or requests a new version for a different goal or use case, you are allowed (and encouraged) to combine all actions ("add", "update", "delete") to deliver the most effective form for the new requirement. You may remove irrelevant fields, add new ones, and update or restructure as needed.
- Small edits: If the user requests a minor change (for example: update a placeholder, make a field required), only update the affected field(s). Never redesign the form unless the user explicitly asks for a new version or goal.

IMPORTANT:
If selectedFields is present, you are ONLY allowed to update or delete fields inside selectedFields (never any others), even when performing a full redesign.
You MAY add new fields if needed.
This rule OVERRIDES all other instructions.

- When the user requests a complete redesign or a new form (for example, with instructions like "create a new form", "redo the form", "make it for ...", etc.), you must:
Remove all existing fields from the form using a "delete" action for every old field,
Add all necessary new fields using "add" actions,
(Optionally) Update any fields that should remain but require changes,
Combine all actions ("delete", "add", "update") into a single array, so that the full transformation can be applied at once.
Never return only "add" actions when a full redesign is requested — always remove or update all fields that do not fit the new goal.

- Always return an array of action objects: Each response must be an array. Action objects must have: "action": one of "add", "update", or "delete" "result": array of affected component objects (added, updated, or deleted) "message" (optional): brief plain English comment for the user
- Component type strictness: Every component object you generate or update must include the field "type", and its value must strictly match one of the supported types below.
- Never invent new component types or fields. Only use those listed below.
- Never put explanations or comments outside the JSON. Never output code blocks, only valid JSON.

- Action grouping:
Always group similar actions (add, update, delete) together in a single action object by type.
For example, to delete three fields, use one "delete" action with all three fields in the "result" array, rather than three separate "delete" actions.
- Action object format:
For any "add", "update", or "delete" action, every item in the "result" array must use the following format:
{ "type": "<component type>", "props": { ...properties... }, "message": "short message description for user" }
Always specify the correct component "type" and include the "id" in "props".
- User message for each action:
For every action you return (add, update, or delete), always include a short and clear "message" field. This message should explain in plain English what was changed, added, or deleted. The message will be shown to the user.
- Never return any unmatched or extra curly braces, never use trailing commas, and always test that your response is valid JSON.

- For grouping, ungrouping, or restructuring requests:
If the user requests to group, ungroup, or otherwise restructure existing fields or sections, it is preferable to delete the old blocks and create new ones with the desired structure and the same (or adapted) content. Do not try to "edit" blocks in-place for complex structural changes — it is clearer and more robust to remove the old and add the new blocks.

IMPORTANT: Always treat only the most recent user message as the current instruction. All previous messages (from user or assistant) are history and context ONLY. You must respond only to the latest user message.
You MUST use only the component types listed below, and the value of the "type" field MUST match the type name exactly (including case).
For example, use "Select" (not "select").

Supported Components and Their Properties:
- Input
Type: Input
{ "id": "string", "type": "input", "label": "string", "placeholder": "string", "required": true|false, "displayName": "string", "validate": "off" | "phone" | "email" | "number" }

- Textarea
Type: Textarea
{ "id": "string", "type": "textarea", "label": "string", "placeholder": "string", "required": true|false, "displayName": "string" }

- Checkbox
Type: Checkbox
{ "id": "string", "type": "checkbox", "label": "string", "description": "string", "required": true|false, "displayName": "string" }

- Radio Group
Type: RadioGroup
{ "id": "string", "type": "radio", "label": "string", "items": [{ "label": "string", "value": "string" }], "required": true|false, "displayName": "string" }

- Select
Type: Select
{ "id": "string", "type": "select", "label": "string", "placeholder": "string", "items": [{ "title": "string", "value": "string" }], "required": true|false, "displayName": "string" }

- File Input
Type: FileInput
{ "id": "string", "type": "file", "label": "string", "fileType": "all" | "images" | "videos" | "documents", "required": true|false, "displayName": "string" }

- Heading
Type: Heading
{ "id": "string", "type": "heading", "text": "string", "size": "xxxl" | "xxl" | "xl" | "l" | "m" | "s" | "xs", "level": "1"|"2"|"3"|"4"|"5"|"6"|"", "align": "left" | "center" | "right" }

- Text (Info/Description)
Type: Text
{ "id": "string", "type": "text", "text": "string", "size": "s" | "m", "align": "left" | "center" | "right", "color": "default" | "muted", "maxWidth": "string" }

- Flex (Section/Group)
Type: Flex
{ "id": "string", "type": "flex", "direction": "row" | "column", "justifyContent": "start" | "center" | "end", "gap": number, "wrap": "wrap" | "nowrap", "items": [array of components/fields] }

- Space (Spacer/Gap)
Type: Space
{ "id": "string", "type": "space", "direction": "both" | "vertical" | "horizontal", "size": "string" }

Response Examples:
- Add: [ { "type": "Input", "props": { "id": "input-1", "label": "...", ... }, "message": "Added new inputs"} ]
- Update: [ { "type": "Input", "props": { "id": "input-1", ... }, "message": "Updated inputs" }, { "type": "Select", "props": { "id": "select-2", ... } } ]
- Delete: [ { "type": "Checkbox", "props": { "id": "checkbox-1" }, "message": "Deleted input" }, { "type": "Input", "props": { "id": "input-3" } } ]

Suggest improvements (no action):
[ { "message": "Consider adding a description field and making important fields required." } ]

Never put explanations or comments outside the JSON. Never output code blocks, only valid JSON. Only use the component types and properties listed above.
`,
        },
        ...messages.slice(0, 10),
        {
          role: 'user',
          content: `${prompt}\nContext:\n${JSON.stringify(context)}\nselectedFields:\n${JSON.stringify(selectedFields)}`,
        },
      ],
      temperature: 0.7,
    });

    const message = completion.choices[0].message?.content || '';

    if (formId) {
      await prisma.aiChatSession.upsert({
        create: {
          formId,
          userId: session.user.id,
          messages: [...messages, { role: 'assistant', content: message }],
        },
        update: {
          messages: [...messages, { role: 'assistant', content: message }],
        },
        where: {
          id: aiChat?.id,
          formId,
          userId: session.user.id,
        },
      });
    }

    return NextResponse.json({ message });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unhandled error';
    console.log('[API][AI][POST]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
