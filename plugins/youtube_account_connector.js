// plugins/youtube_account_connector.js
// Dynamic Sovereign AI Plugin for YouTube Channel Linking & Account Discovery

module.exports = {
  name: "youtube_account_connector",
  description: "Securely retrieves, auto-discovers, and links YouTube channels/accounts using Google email addresses and handles. Updates system memory to make channel status instantly visible to Claude Desktop and the Web Console.",
  inputSchema: {
    type: "object",
    properties: {
      email: {
        type: "string",
        description: "The Google/Gmail account email address (e.g. justifiedmagnificent@gmail.com)."
      },
      youtubeUrl: {
        type: "string",
        description: "The YouTube channel URL or handle (e.g. https://youtube.com/@JustifiedMagnificent or @JustifiedMagnificent). Optional - if omitted, the system will auto-resolve the primary channel for this email."
      }
    },
    required: ["email"]
  },
  async execute(args, helpers) {
    const { email, youtubeUrl } = args;
    const { makeRequest, debugLog } = helpers;

    debugLog(`[YouTubeConnector] Discovering YouTube accounts for email: ${email}`);

    try {
      // Dispatch payload to Empire OS REST endpoint
      const res = await makeRequest("POST", "/api/youtube/account/link", {
        email,
        youtubeUrl: youtubeUrl || ""
      });

      if (!res.success) {
        throw new Error(res.error || "Failed to resolve or link YouTube channel profile.");
      }

      return {
        status: "success",
        message: `🎉 YouTube account linked successfully for ${email}!`,
        connected_profile: res.account,
        instructions: "The YouTube account is fully active and synchronized in the memories. You can now publish videos or query metrics directly under this identity."
      };
    } catch (err) {
      return {
        status: "error",
        message: `Failed to discover/link YouTube channel: ${err.message}`
      };
    }
  }
};
