import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get title, description and logo from the URL query params
    const title = searchParams.get("title");
    const description = searchParams.get("description");
    const logoUrl = searchParams.get("logo");

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "80px",
            backgroundColor: "white",
            backgroundImage:
              "radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)",
            backgroundSize: "100px 100px",
          }}
        >
          {/* Logo section */}
          {logoUrl && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "40px",
              }}
            >
              <img
                src={logoUrl}
                alt="Logo"
                style={{
                  width: "160px",
                  height: "160px",
                  objectFit: "contain",
                }}
              />
            </div>
          )}
          
          {/* Title */}
          <div
            style={{
              display: "flex",
              fontSize: 60,
              fontStyle: "normal",
              color: "black",
              marginBottom: 30,
              whiteSpace: "pre-wrap",
              lineHeight: 1.2,
              maxWidth: "800px",
              fontWeight: "bold",
            }}
          >
            {title}
          </div>
          
          {/* Description */}
          {description && (
            <div
              style={{
                fontSize: 30,
                fontStyle: "normal",
                color: "gray",
                whiteSpace: "pre-wrap",
                lineHeight: 1.2,
                maxWidth: "800px",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {description}
            </div>
          )}
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
