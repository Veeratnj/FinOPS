terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# 1. Overprovisioned web app server (running at ~12% CPU peak)
resource "aws_instance" "web_cluster_node_1" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "m5.4xlarge"

  tags = {
    Name        = "web-cluster-node-1"
    Environment = "production"
    Service     = "frontend-api"
  }
}

# 2. Idle development GPU experiment worker
resource "aws_instance" "ml_inference_worker" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "g4dn.xlarge"

  tags = {
    Name        = "ml-inference-worker"
    Environment = "dev"
    Team        = "data-science"
  }
}

# 3. Unattached legacy storage volume
resource "aws_ebs_volume" "analytics_backup_store" {
  availability_zone = "us-east-1a"
  size              = 500
  type              = "gp2"

  tags = {
    Name        = "analytics-backup-store"
    Environment = "production"
  }
}

# 4. Completely idle legacy micro instance
resource "aws_instance" "idle_legacy_bastion" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"

  tags = {
    Name        = "idle-legacy-bastion"
    Environment = "staging"
  }
}
