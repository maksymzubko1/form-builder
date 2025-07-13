import { notFound } from 'next/navigation';

export default async function PublicFormPage() {
  // TODO: load from DB
  const form = null; // await getForm(params.id)
  if (!form) return notFound();

  return (
    <div className="max-w-lg mx-auto py-12">
      <h1 className="text-2xl font-bold mb-4">Форма</h1>
      {/* TODO: Puck Editor render */}
      <div className="bg-white p-4 rounded shadow">Форма для заполнения</div>
    </div>
  );
}
