import * as grpc from "@grpc/grpc-js";

import { AuthServiceRoutesClient } from "@/proto/auth/auth";
import { SERVER_ADDRESS_GRPC_AUTH } from "@/config";

const serverAddress: string = SERVER_ADDRESS_GRPC_AUTH || "";

const client: AuthServiceRoutesClient = new AuthServiceRoutesClient(
  serverAddress,
  grpc.credentials.createInsecure()
);

export default client;


