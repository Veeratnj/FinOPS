"""
Security utilities for JWT tokens and password hashing.
"""

from datetime import datetime, timedelta
from typing import Any, Union

from jose import jwt
from app.core.config import settings
import bcrypt

class BcryptContext:
    def verify(self, secret: str, hash: str) -> bool:
        try:
            return bcrypt.checkpw(secret.encode("utf-8")[:72], hash.encode("utf-8"))
        except Exception:
            return False

    def hash(self, secret: str) -> str:
        return bcrypt.hashpw(secret.encode("utf-8")[:72], bcrypt.gensalt()).decode("utf-8")

pwd_context = BcryptContext()
PASSWORD_MAX_BYTES = 72


def validate_password(password: str) -> str:
    """Validate password length for bcrypt hashing."""
    if len(password.encode("utf-8")) > PASSWORD_MAX_BYTES:
        raise ValueError(
            f"password cannot be longer than {PASSWORD_MAX_BYTES} bytes, "
            "truncate manually if necessary (e.g. my_password[:72])"
        )
    return password


def create_access_token(
    subject: Union[str, Any], expires_delta: timedelta = None, extra_claims: dict[str, Any] | None = None
) -> str:
    """Create JWT access token."""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode = {"exp": expire, "sub": str(subject), "type": "access"}
    if extra_claims:
        to_encode.update(extra_claims)
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt


def create_refresh_token(
    subject: Union[str, Any], expires_delta: timedelta = None, extra_claims: dict[str, Any] | None = None
) -> str:
    """Create JWT refresh token."""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES
        )

    to_encode = {"exp": expire, "sub": str(subject), "type": "refresh"}
    if extra_claims:
        to_encode.update(extra_claims)
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt


def verify_token(token: str) -> dict:
    """Verify and decode JWT token."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired")
    except jwt.JWTError:
        raise ValueError("Invalid token")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password after validating its bcrypt byte-length."""
    validate_password(password)
    return pwd_context.hash(password)