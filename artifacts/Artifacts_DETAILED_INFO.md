What are Artifacts and how do I use them?
Updated over a week ago
Artifacts allow Claude to share substantial, standalone content with you in a dedicated window separate from the main conversation. Artifacts make it easy to work with significant pieces of content that you may want to modify, build upon, or reference later.

 

When does Claude use Artifacts?
Claude creates an Artifact when the content it is sharing has the following characteristics:

It is significant and self-contained, typically over 15 lines of content

It is something you are likely to want to edit, iterate on, or reuse outside the conversation

It represents a complex piece of content that stands on its own without requiring extra conversation context

It is content you are likely to want to refer back to or use later on

 

Some common examples of Artifact content include:

Documents (Markdown or Plain Text)

Code snippets

Websites (single page HTML)

Scalable Vector Graphics (SVG) images

Diagrams and flowcharts

Interactive React components

 

How do I use Artifacts?
When Claude creates an Artifact, you'll see the Artifact content displayed in a new dedicated window to the right side of the main chat. This allows you to easily view, copy, and work with the Artifact content.

 

A few key things to know about interacting with Artifacts:

You can ask Claude to edit or iterate on the content and these updates will be displayed directly in the Artifact window.  

These edits won't change Claude's memory of the original Artifact content, and you can switch between each version using the version selector at the bottom left of the Artifact. 

You can open and view multiple Artifacts in one conversation using the chat controls. To access this, click on the slider icon in the upper right corner. Select the Artifact you’d like Claude to reference and then continue where you last left off. 

Claude may update an existing Artifact in response to your messages. The Artifact window will update to show the latest content.

You can view the underlying code of an Artifact, copy the content to your clipboard, or download a file to easily reuse it outside the conversation. These options are located in the upper right corner of your Artifact. 

Editing Artifacts with the analysis tool enabled
This functionality requires the analysis tool feature. For more information on enabling this feature, visit the resource here.

With the analysis tool feature enabled, Claude can make targeted changes to specific sections of an Artifact instead of rewriting it entirely. There are two ways to edit Artifacts:

 

1. Targeted Updates

For small changes to specific sections, Claude can update just that portion while leaving the rest unchanged.

You can simply describe what you want changed and where.

For example: "Could you change the color of the button from red to blue?" or “Update the first paragraph to include a problem statement.”

2. Full Rewrites

For major changes affecting most of the content, Claude can rewrite a new version

This is better for substantial restructuring or when multiple sections need to change

For example: "Could you completely redesign the button to be a toggle instead?" or “Could you rewrite this technical documentation to be a customer-facing FAQ instead?”

In both cases, each edit creates a new version that you can access through the version selector, letting you track changes while you work.

 

Best Practices:

Be specific about which part you want to change

For targeted updates, reference unique identifying text around your desired change

Consider whether a small update or full rewrite would be more appropriate for your needs


----

Artifacts
Integrate workspaces for activities that involve complex and persistent user interactions

Artifacts is a special user interface mode that allows you to have a workspace like interface along with the chat interface. This is similar to ChatGPT's Canvas and Claude's Artifacts.

The template already ships with the following artifacts:

Text Artifact: Work with text content like drafting essays and emails.
Code Artifact: Write and execute code snippets.
Image Artifact: Work with images like editing, annotating, and processing images.
Sheet Artifact: Work with tabular data like creating, editing, and analyzing data.
Adding a Custom Artifact
To add a custom artifact, you will need to create a folder in the artifacts directory with the artifact name. The folder should contain the following files:

client.tsx: The client-side code for the artifact.
server.ts: The server-side code for the artifact.
Here is an example of a custom artifact called CustomArtifact:


artifacts/
  custom/
    client.tsx
    server.ts
Client-Side Example (client.tsx)
This file is responsible for rendering your custom artifact. You might replace the inner UI with your own components, but the overall pattern (initialization, handling streamed data, and rendering content) remains the same. For instance:


import { Artifact } from "@/components/create-artifact";
import { ExampleComponent } from "@/components/example-component";
import { toast } from "sonner";
 
interface CustomArtifactMetadata {
  // Define metadata your custom artifact might need—the example below is minimal.
  info: string;
}
 
export const customArtifact = new Artifact<"custom", CustomArtifactMetadata>({
  kind: "custom",
  description: "A custom artifact for demonstrating custom functionality.",
  // Initialization can fetch any extra data or perform side effects
  initialize: async ({ documentId, setMetadata }) => {
    // For example, initialize the artifact with default metadata.
    setMetadata({
      info: `Document ${documentId} initialized.`,
    });
  },
  // Handle streamed parts from the server (if your artifact supports streaming updates)
  onStreamPart: ({ streamPart, setMetadata, setArtifact }) => {
    if (streamPart.type === "info-update") {
      setMetadata((metadata) => ({
        ...metadata,
        info: streamPart.content as string,
      }));
    }
    if (streamPart.type === "content-update") {
      setArtifact((draftArtifact) => ({
        ...draftArtifact,
        content: draftArtifact.content + (streamPart.content as string),
        status: "streaming",
      }));
    }
  },
  // Defines how the artifact content is rendered
  content: ({
    mode,
    status,
    content,
    isCurrentVersion,
    currentVersionIndex,
    onSaveContent,
    getDocumentContentById,
    isLoading,
    metadata,
  }) => {
    if (isLoading) {
      return <div>Loading custom artifact...</div>;
    }
 
    if (mode === "diff") {
      const oldContent = getDocumentContentById(currentVersionIndex - 1);
      const newContent = getDocumentContentById(currentVersionIndex);
      return (
        <div>
          <h3>Diff View</h3>
          <pre>{oldContent}</pre>
          <pre>{newContent}</pre>
        </div>
      );
    }
 
    return (
      <div className="custom-artifact">
        <ExampleComponent
          content={content}
          metadata={metadata}
          onSaveContent={onSaveContent}
          isCurrentVersion={isCurrentVersion}
        />
        <button
          onClick={() => {
            navigator.clipboard.writeText(content);
            toast.success("Content copied to clipboard!");
          }}
        >
          Copy
        </button>
      </div>
    );
  },
  // An optional set of actions exposed in the artifact toolbar.
  actions: [
    {
      icon: <span>⟳</span>,
      description: "Refresh artifact info",
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: "user",
          content: "Please refresh the info for my custom artifact.",
        });
      },
    },
  ],
  // Additional toolbar actions for more control
  toolbar: [
    {
      icon: <span>✎</span>,
      description: "Edit custom artifact",
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: "user",
          content: "Edit the custom artifact content.",
        });
      },
    },
  ],
});
Server-Side Example (server.ts)

The server file processes the document for the artifact. It streams updates (if applicable) and returns the final content. For example:


import { smoothStream, streamText } from "ai";
import { myProvider } from "@/lib/ai/providers";
import { createDocumentHandler } from "@/lib/artifacts/server";
import { updateDocumentPrompt } from "@/lib/ai/prompts";
 
export const customDocumentHandler = createDocumentHandler<"custom">({
  kind: "custom",
  // Called when the document is first created.
  onCreateDocument: async ({ title, dataStream }) => {
    let draftContent = "";
    // For demonstration, use streamText to generate content.
    const { fullStream } = streamText({
      model: myProvider.languageModel("artifact-model"),
      system:
        "Generate a creative piece based on the title. Markdown is supported.",
      experimental_transform: smoothStream({ chunking: "word" }),
      prompt: title,
    });
 
    // Stream the content back to the client.
    for await (const delta of fullStream) {
      if (delta.type === "text-delta") {
        draftContent += delta.textDelta;
        dataStream.writeData({
          type: "content-update",
          content: delta.textDelta,
        });
      }
    }
 
    return draftContent;
  },
  // Called when updating the document based on user modifications.
  onUpdateDocument: async ({ document, description, dataStream }) => {
    let draftContent = "";
    const { fullStream } = streamText({
      model: myProvider.languageModel("artifact-model"),
      system: updateDocumentPrompt(document.content, "custom"),
      experimental_transform: smoothStream({ chunking: "word" }),
      prompt: description,
      experimental_providerMetadata: {
        openai: {
          prediction: {
            type: "content",
            content: document.content,
          },
        },
      },
    });
 
    for await (const delta of fullStream) {
      if (delta.type === "text-delta") {
        draftContent += delta.textDelta;
        dataStream.writeData({
          type: "content-update",
          content: delta.textDelta,
        });
      }
    }
 
    return draftContent;
  },
});
Once you have created the client and server files, you can import the artifact in the lib/artifacts/server.ts file and add it to the documentHandlersByArtifactKind array.


export const documentHandlersByArtifactKind: Array<DocumentHandler> = [
  ...,
  customDocumentHandler,
];
 
export const artifactKinds = [..., "custom"] as const;
Specify it in document schema at lib/db/schema.ts.


export const document = pgTable(
  "Document",
  {
    id: uuid("id").notNull().defaultRandom(),
    createdAt: timestamp("createdAt").notNull(),
    title: text("title").notNull(),
    content: text("content"),
    kind: varchar("text", { enum: [..., "custom"] }) // Add the custom artifact kind here
      .notNull()
      .default("text"),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    };
  },
);
And also add the client-side artifact to the artifactDefinitions array in the components/artifact.tsx file.


import { customArtifact } from "@/artifacts/custom/client";
 
export const artifactDefinitions = [..., customArtifact];
You should now be able to see the custom artifact in the workspace!