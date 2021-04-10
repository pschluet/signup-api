terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws",
      version = "3.4.0"
    }
  }

  backend "s3" {
    bucket = "paul-terraform-backends"
    key    = "signup-api-rds.tfstate"
    region = "us-east-1"
  }
}

variable "DB_USERNAME" {
  # Environment variable set in the GitHub actions pipeline
  type = string
}

variable "DB_PASSWORD" {
  # Environment variable set in the GitHub actions pipeline
  type = string
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_db_subnet_group" "rds" {
  name       = "rds-subnet-group"
  subnet_ids = ["subnet-03a512caca489d92e", "subnet-0fc5a8422e7b6977f"]
}

resource "aws_ssm_parameter" "db_password" {
  name        = "db_password"
  description = "Database password"
  type        = "SecureString"
  value       = var.DB_PASSWORD
}

resource "aws_ssm_parameter" "db_username" {
  name        = "db_username"
  description = "Database username"
  type        = "SecureString"
  value       = var.DB_USERNAME
}

resource "aws_db_instance" "prod" {
  allocated_storage       = 20 # gigabytes
  backup_retention_period = 5  # in days
  db_subnet_group_name    = aws_db_subnet_group.rds.name
  engine                  = "postgres"
  engine_version          = "12.5"
  identifier              = "prod"
  instance_class          = "db.t2.micro"
  multi_az                = false
  name                    = "prod-main"
  password                = var.DB_PASSWORD
  port                    = 5432
  publicly_accessible     = true
  storage_encrypted       = false # this should be true in production
  storage_type            = "gp2"
  username                = var.DB_USERNAME
  vpc_security_group_ids  = ["sg-0255e56b16aeefad8"]
}