from fastapi import APIRouter, Depends, HTTPException, status
from models import PostCreate, PostResponse, CommentCreate
from database import get_db
from auth_utils import get_current_user
from bson import ObjectId
from datetime import datetime, timezone

router = APIRouter(prefix="/api/posts", tags=["posts"])


@router.get("", response_model=list[PostResponse])
async def get_posts():
    db = get_db()
    posts_collection = db["posts"]

    posts = await posts_collection.find().sort("createdAt", -1).to_list(length=100)
    result = []
    for post in posts:
        result.append(PostResponse(
            id=str(post["_id"]),
            title=post["title"],
            category=post.get("category", "General"),
            body=post["body"],
            author=post["author"],
            authorId=post.get("authorId", ""),
            likes=post.get("likes", 0),
            likedBy=post.get("likedBy", []),
            comments=post.get("comments", []),
            createdAt=post.get("createdAt", ""),
        ))
    return result


@router.post("", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(data: PostCreate, current_user: dict = Depends(get_current_user)):
    db = get_db()
    posts_collection = db["posts"]

    post_doc = {
        "title": data.title,
        "category": data.category,
        "body": data.body,
        "author": current_user["email"],
        "authorId": current_user["user_id"],
        "likes": 0,
        "likedBy": [],
        "comments": [],
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }

    result = await posts_collection.insert_one(post_doc)

    return PostResponse(
        id=str(result.inserted_id),
        title=data.title,
        category=data.category,
        body=data.body,
        author=current_user["email"],
        authorId=current_user["user_id"],
        likes=0,
        likedBy=[],
        comments=[],
        createdAt=post_doc["createdAt"],
    )


@router.post("/{post_id}/like", response_model=PostResponse)
async def toggle_like(post_id: str, current_user: dict = Depends(get_current_user)):
    db = get_db()
    posts_collection = db["posts"]

    post = await posts_collection.find_one({"_id": ObjectId(post_id)})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    liked_by = post.get("likedBy", [])
    user_email = current_user["email"]

    if user_email in liked_by:
        liked_by.remove(user_email)
        likes = max(0, post.get("likes", 0) - 1)
    else:
        liked_by.append(user_email)
        likes = post.get("likes", 0) + 1

    await posts_collection.update_one(
        {"_id": ObjectId(post_id)},
        {"$set": {"likedBy": liked_by, "likes": likes}},
    )

    post["likedBy"] = liked_by
    post["likes"] = likes

    return PostResponse(
        id=str(post["_id"]),
        title=post["title"],
        category=post.get("category", "General"),
        body=post["body"],
        author=post["author"],
        authorId=post.get("authorId", ""),
        likes=likes,
        likedBy=liked_by,
        comments=post.get("comments", []),
        createdAt=post.get("createdAt", ""),
    )


@router.post("/{post_id}/comments", response_model=PostResponse)
async def add_comment(post_id: str, data: CommentCreate, current_user: dict = Depends(get_current_user)):
    db = get_db()
    posts_collection = db["posts"]

    post = await posts_collection.find_one({"_id": ObjectId(post_id)})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    new_comment = {"author": current_user["email"], "text": data.text}
    comments = post.get("comments", [])
    comments.append(new_comment)

    await posts_collection.update_one(
        {"_id": ObjectId(post_id)},
        {"$set": {"comments": comments}},
    )

    return PostResponse(
        id=str(post["_id"]),
        title=post["title"],
        category=post.get("category", "General"),
        body=post["body"],
        author=post["author"],
        authorId=post.get("authorId", ""),
        likes=post.get("likes", 0),
        likedBy=post.get("likedBy", []),
        comments=comments,
        createdAt=post.get("createdAt", ""),
    )
