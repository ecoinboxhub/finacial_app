from models import UserCreate, UserLogin, PostCreate, CommentCreate


def test_user_create():
    data = UserCreate(name="Test User", email="test@example.com", password="secret123")
    assert data.name == "Test User"
    assert data.email == "test@example.com"
    assert data.password == "secret123"


def test_user_login():
    data = UserLogin(email="test@example.com", password="secret123")
    assert data.email == "test@example.com"
    assert data.password == "secret123"


def test_post_create():
    data = PostCreate(title="Test Post", category="General", body="Test body")
    assert data.title == "Test Post"
    assert data.category == "General"
    assert data.body == "Test body"


def test_post_create_default_category():
    data = PostCreate(title="Test Post", body="Test body")
    assert data.category == "General"


def test_comment_create():
    data = CommentCreate(text="Nice post!")
    assert data.text == "Nice post!"
