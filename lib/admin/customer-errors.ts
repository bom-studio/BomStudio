export class CustomersTableMissingError extends Error {
  constructor(message = "customers 테이블이 없습니다.") {
    super(message);
    this.name = "CustomersTableMissingError";
  }
}

export function isCustomersTableMissingError(error: unknown): boolean {
  if (error instanceof CustomersTableMissingError) return true;
  if (error instanceof Error) {
    return (
      error.message.includes("Could not find the table 'public.customers'") ||
      error.message.includes('relation "public.customers" does not exist') ||
      error.message.includes('relation "customers" does not exist')
    );
  }
  return false;
}

export function assertCustomersQueryOk(error: { message: string } | null) {
  if (!error) return;
  if (isCustomersTableMissingError(error)) {
    throw new CustomersTableMissingError();
  }
  throw new Error(error.message);
}
