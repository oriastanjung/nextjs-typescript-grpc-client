"use server"
import { clientAuth } from "@/grpc/grpcClient";
import { LoginGoogleRequest, LoginGoogleResponse } from "@/proto/auth/addition";
import { LoginResponse } from "@/proto/auth/login";
import { Empty } from "@/proto/google/protobuf/empty";
import { ServiceError } from "@grpc/grpc-js";

export async function LoginByGoogle(): Promise<LoginGoogleResponse> {
  return new Promise((resolve, reject) => {
    const request: Empty = Empty.create();

    clientAuth.loginUserViaGoogle(request, (err: ServiceError | null, response : LoginGoogleResponse) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}



export async function LoginByGoogleCallback({email, pictureUrl, username }:{email: string | any, pictureUrl: string | any, username: string | any}): Promise<LoginResponse> {
  return new Promise((resolve, reject) => {
    const request: LoginGoogleRequest = LoginGoogleRequest.fromPartial(
      {
        email : email,
        pictureUrl : pictureUrl,
        username : username
      }
    );

    clientAuth.loginUserViaGoogleCallback(request, (err: ServiceError | null, response : LoginResponse) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  })
}