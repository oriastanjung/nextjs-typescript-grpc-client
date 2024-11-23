import { LoginByGoogleCallback } from "@/actions/google_auth";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    // Ensure code and state exist
    if (!code || !state) {
      return NextResponse.json(
        { error: "Missing code or state parameter" },
        { status: 400 }
      );
    }

    // Verify the state to ensure CSRF protection
    if (state !== process.env.NEXT_PUBLIC_GOOGLE_OAUTH_STATE_STRING) {
      return NextResponse.json(
        { error: "Invalid state parameter" },
        { status: 400 }
      );
    }

    // Initialize the OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID,
      process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_SECRET,
      process.env.NEXT_PUBLIC_GOOGLE_AUTH_REDIRECT_URL
    );

    // Exchange the authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    // Set the credentials for the OAuth2 client
    oauth2Client.setCredentials(tokens);

    // Retrieve user info
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });
    const userInfo = await oauth2.userinfo.get();

    // Handle the user login with your database
    const responseLoginGoogle = await LoginByGoogleCallback({
      email: userInfo.data.email,
      pictureUrl: userInfo.data.picture,
      username: userInfo.data.name,
    });

    // Set the token in the cookie
    const response = NextResponse.redirect(new URL("/dashboard", req.url));
    response.cookies.set("__t__", responseLoginGoogle.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 3600, // 1 hour in seconds
    });

    return response;
  } catch (error: any) {
    console.error("Error in Google callback:", error.message);
    return NextResponse.json(
      { error: "Authentication failed", details: error.message },
      { status: 500 }
    );
  }
}
