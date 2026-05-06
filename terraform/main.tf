terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

data "aws_vpc" "default" {
  default = true
}

resource "aws_security_group" "phantasm" {
  name        = "phantasm-security-group"
  description = "Allow SSH, HTTP, and controller access"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3003
    to_port     = 3003
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "phantasm-security-group"
  }
}

resource "aws_instance" "phantasm" {
  ami                    = "ami-091138d0f0d41ff90"  # Ubuntu 26.04 LTS (HVM, SSD)
  instance_type          = "t3.micro"
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.phantasm.id]

  user_data = <<-EOF
    #!/bin/bash
    set -e
    apt-get update
    apt-get install -y ca-certificates curl gnupg lsb-release
    curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
    sh /tmp/get-docker.sh
    usermod -aG docker ubuntu
  EOF

  tags = {
    Name = "phantasm-server"
  }
}

resource "aws_eip" "phantasm" {
  domain = "vpc"

  tags = {
    Name = "phantasm-eip"
  }
}

resource "aws_eip_association" "phantasm" {
  instance_id   = aws_instance.phantasm.id
  allocation_id = aws_eip.phantasm.id
}