const { gql } = require('apollo-server');

module.exports = gql`
    type Post{
        id: ID!
        body: String!
        username: String!
        createdAt: String!
        comments: [Comment]!
        likes: [Like]!
        likeCount: Int!
        commentCount: Int!
        postType: String!
        url: String!
    }
    type Comment{
        id: ID!
        createdAt: String!
        username: String
        body: String!
        userVerified: Boolean!
        userPermission: Int!
        likes: [Like]!
        likeCount: Int!
        replies: [Reply]!
        replyCount: Int!
    }
    type Reply{
        id: ID!
        username: String!
        createdAt: String!
        body: String!
        likes: [Like]!
        likeCount: Int!
        userVerified: Boolean!
        userPermission: Int!
    }
    type Like{
        id: ID!
        createdAt: String!
        username: String!
    }
    type Subscription{
        newPost: Post!
    }
    type User{
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
        verified: Boolean!
        permission: Int!
        settings: [Settings]!
    }
    type Profile{
        id: ID!
        username: String!
        profileIcon: Int!
        profileColor: Int!
        verified: Boolean!
        permission: Int!
        balanceHidden: Boolean!
        balance: Int!
        posts: [ID!]
    }
    type UploadFile{
        id: ID!
        fileName: String!
        uploadDate: String!
        uploadUser: String!
        public: Boolean!
        size: Float!
        fileType: String!
        metaData: String!
        chunks: [String]!
    }
    type File{
        id: ID!
        fileName: String!
        uploadDate: String!
        uploadUser: String!
        public: Boolean!
        size: Float!
        fileType: String!
        metaData: String!
        data: String!
    }
    type Settings{
        darkMode: Boolean!
    }
    input RegisterInput{
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }
    type Query{
        getPosts(sortType: Int): [Post]
        getPost(postId: ID!): Post
        getUserSettings: Settings!
        getProfile(username: String!): Profile!
        getFile(id: ID!): File!
    }
    type Mutation{
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
        changeProfileIcon(icon: Int!): Profile!
        changeProfileColor(color: Int!): Profile!
        createPost(body: String!): Post!
        deletePost(postId: ID!): String!
        createComment(postId: ID!, body: String!): Post!
        deleteComment(postId: ID!, commentId: ID!): Post!
        likePost(postId: ID!): Post!
        createReply(postId: ID!, commentId: ID!, body: String!): Post!
        deleteReply(postId: ID!, commentId: ID!, replyId: ID!): Post!
        likeComment(postId: ID!, commentId: ID!): Post!
        likeReply(postId: ID!, commentId: ID!, replyId: ID!): Post!
        uploadFile(file: Upload!): UploadFile!
        deleteFile(fileId: ID!): String!
        uploadImage(image: Upload!): String!
    }
`;