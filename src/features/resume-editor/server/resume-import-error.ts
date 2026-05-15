export class ResumeImportError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "ResumeImportError";
    this.status = status;
  }
}
