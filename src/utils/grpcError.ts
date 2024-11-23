import { ServiceError } from "@grpc/grpc-js";

export function outputGrpcErrorMessage(error: any) {
  const grpcError = error as ServiceError;

  // Extract meaningful error message
  let errorMessage: string;

  if (grpcError?.details) {
    errorMessage = grpcError.details; // Use details if available
  } else if (grpcError?.message) {
    // Extract the part after 'desc =' in the gRPC error message
    const match = grpcError.message.match(/desc = (.+)$/);
    errorMessage = match ? match[1].trim() : "An unknown error occurred";
  } else {
    errorMessage = "An unknown error occurred"; // Fallback
  }
  return errorMessage;
}
