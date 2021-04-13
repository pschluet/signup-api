terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws",
      version = "3.19.0"
    }
  }

  backend "s3" {
    bucket = "paul-terraform-backends"
    key    = "signup-api-cognito.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_cognito_user_pool" "main" {
  name = "signup-api-user-pool"

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  admin_create_user_config {
    allow_admin_create_user_only = true
  }

  auto_verified_attributes = ["email"]

  device_configuration {
    device_only_remembered_on_user_prompt = true
  }

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  username_attributes = ["email"]

  username_configuration {
    case_sensitive = false
  }
}

resource "aws_cognito_user_pool_client" "main" {
  name                                 = "signup-api-user-pool-client"
  user_pool_id                         = aws_cognito_user_pool.main.id
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code", "implicit"]
  allowed_oauth_scopes                 = ["email", "openid", "profile", "aws.cognito.signin.user.admin"]
  callback_urls                        = ["https://www.example.com"]
  logout_urls                          = ["https://www.example.com"]
  supported_identity_providers         = ["COGNITO"]
}

resource "aws_cognito_user_pool_domain" "main" {
  domain       = "signup-api-6441232"
  user_pool_id = aws_cognito_user_pool.main.id
}