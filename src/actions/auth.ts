"use server"
import { clientAuth } from "@/grpc/grpcClient";
import { LoginRequest, LoginResponse } from "@/proto/auth/login";
import { ServiceError } from "@grpc/grpc-js";
export async function LoginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  return new Promise((resolve, reject) => {
    const request: LoginRequest = LoginRequest.fromPartial({
      email: email,
      password: password,
    });

    clientAuth.loginUser(request, (err: ServiceError | null, response : LoginResponse) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}



