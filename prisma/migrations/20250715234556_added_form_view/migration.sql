-- CreateTable
CREATE TABLE "FormView" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "viewer_email" TEXT NOT NULL,
    "viewer_ip" TEXT,

    CONSTRAINT "FormView_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FormView" ADD CONSTRAINT "FormView_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;
