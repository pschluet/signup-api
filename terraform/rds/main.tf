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

provider "aws" {
  region = "us-east-1"
}

resource "aws_db_subnet_group" "rds" {
  name       = "rds-subnet-group"
  subnet_ids = ["subnet-03a512caca489d92e"]
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
  password                = TODO: GitHub secrets.DB_PASSWORD
  port                    = 5432
  publicly_accessible     = true
  storage_encrypted       = true # you should always do this
  storage_type            = "gp2"
  username                = TODO: GitHub secrets.DB_USERNAME
  vpc_security_group_ids  = ["sg-0255e56b16aeefad8"]
}