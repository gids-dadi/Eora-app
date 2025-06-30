import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://fra.cloud.appwrite.io/v1",
  platform: "com.gidiz.Eora",
  projectId: "6778591d003c88285672",
  databaseId: "6779b7fb00296c6aa5b6", 
  userCollectionId: "6779b81f001b5e50e76e",
  videoCollectionId: "6779b8600035c5375951",
  storageId: "6779bc620035d39e4b23",
};

const { endpoint, projectId, platform, databaseId, userCollectionId, videoCollectionId, storageId } = config;

// Initialize client first
const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

// Then initialize services
const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register user
export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw new Error("Failed to create account");

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      databaseId,
      userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );
    
    console.log("New user created:", newUser);
    return newUser;
  } catch (error) {
    console.error("Error in createUser:", error);
    throw new Error(error.message || error);
  }
}

// Sign In
export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.error("Error in signIn:", error);
    throw new Error(error.message || error);
  }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();
    return currentAccount;
  } catch (error) {
    console.error("Error in getAccount:", error);
    throw new Error(error.message || error);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw new Error("No current account found");

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser || currentUser.documents.length === 0) {
      throw new Error("No current user found");
    }

    return currentUser.documents[0];
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return null;
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.error("Error in signOut:", error);
    throw new Error(error.message || error);
  }
}

// Upload File
export async function uploadFile(file, type) {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      config.storageId, // FIXED: was appwriteConfig.storageId
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    console.error("Error in uploadFile:", error);
    throw new Error(error.message || error);
  }
}

// Get File Preview
// export async function getFilePreview(fileId, type) {
//   let fileUrl;

//   try {
//     if (type === "video") {
//       fileUrl = storage.getFileView(config.storageId, fileId); // FIXED: was appwriteConfig.storageId
//     } else if (type === "image") {
//       fileUrl = storage.getFilePreview(
//         config.storageId, // FIXED: was appwriteConfig.storageId
//         fileId,
//         2000,
//         2000,
//         "top",
//         100
//       );
//     } else {
//       throw new Error("Invalid file type");
//     }

//     if (!fileUrl) throw new Error("Failed to get file preview");

//     return fileUrl;
//   } catch (error) {
//     console.error("Error in getFilePreview:", error);
//     throw new Error(error.message || error);
//   }
// }

// Create Video Post
export async function createVideoPost(form) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      databaseId, 
      videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    console.error("Error in createVideoPost:", error);
    throw new Error(error.message || error);
  }
}

// Get all video Posts
export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      databaseId, // FIXED: was appwriteConfig.databaseId
      videoCollectionId // FIXED: was appwriteConfig.videoCollectionId
    );

    return posts.documents;
  } catch (error) {
    console.error("Error in getAllPosts:", error);
    throw new Error(error.message || error);
  }
}

// Get video posts created by user
export async function getUserPosts(userId) {
  try {
    const posts = await databases.listDocuments(
      config.databaseId, // FIXED: was appwriteConfig.databaseId
      config.videoCollectionId, // FIXED: was appwriteConfig.videoCollectionId
      [Query.equal("creator", userId)]
    );

    return posts.documents;
  } catch (error) {
    console.error("Error in getUserPosts:", error);
    throw new Error(error.message || error);
  }
}

// Get video posts that matches search query
export async function searchPosts(query) {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.search("title", query)]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    console.error("Error in searchPosts:", error);
    throw new Error(error.message || error);
  }
}

// Get latest created video posts
export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
    databaseId,
    videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents;
  } catch (error) {
    console.error("Error in getLatestPosts:", error);
    throw new Error(error.message || error);
  }
}