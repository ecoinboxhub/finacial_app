from auth_utils import hash_password, verify_password, create_access_token, decode_token


def test_hash_password():
    password = "test123"
    hashed = hash_password(password)
    assert hashed != password
    assert verify_password(password, hashed)


def test_verify_password_wrong():
    hashed = hash_password("correct")
    assert not verify_password("wrong", hashed)


def test_create_access_token():
    token = create_access_token("user123", "test@example.com")
    assert token
    assert isinstance(token, str)


def test_decode_token():
    token = create_access_token("user123", "test@example.com")
    payload = decode_token(token)
    assert payload["sub"] == "user123"
    assert payload["email"] == "test@example.com"


def test_different_tokens():
    token1 = create_access_token("user1", "a@example.com")
    token2 = create_access_token("user2", "b@example.com")
    assert token1 != token2
