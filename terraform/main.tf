terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.28"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

variable "cloudflare_api_token" {
  description = "The Cloudflare API Token for provisioning resources"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "The Cloudflare Account ID where resources will be created"
  type        = string
}

variable "project_prefix" {
  description = "Prefix for the created resources"
  type        = string
  default     = "vivid-vitablends"
}

variable "environment" {
  description = "The environment (e.g., dev, prod)"
  type        = string
  default     = "prod"
}

# -------------------------------------------------------------
# 1. Cloudflare D1 Database (Serverless SQLite)
# Note: Cloudflare Terraform provider does not fully support
#       creating D1 databases natively via `cloudflare_d1_database` 
#       in all versions. However, we can use it if available in 4.x.
#       Let's create it.
# -------------------------------------------------------------
resource "cloudflare_d1_database" "main_db" {
  account_id = var.cloudflare_account_id
  name       = "${var.project_prefix}-db-${var.environment}"
}

# -------------------------------------------------------------
# 2. Cloudflare KV Namespace (Caching and Rate Limiting)
# -------------------------------------------------------------
resource "cloudflare_workers_kv_namespace" "cache_kv" {
  account_id = var.cloudflare_account_id
  title      = "${var.project_prefix}-cache-${var.environment}"
}

# -------------------------------------------------------------
# 3. Cloudflare R2 Bucket (Image Storage)
# -------------------------------------------------------------
resource "cloudflare_r2_bucket" "image_bucket" {
  account_id = var.cloudflare_account_id
  name       = "${var.project_prefix}-${var.environment}"
  # R2 requires location hint in some cases, but auto is usually fine.
}

# -------------------------------------------------------------
# 4. Cloudflare Pages Project (Frontend)
# -------------------------------------------------------------
resource "cloudflare_pages_project" "frontend" {
  account_id        = var.cloudflare_account_id
  name              = "${var.project_prefix}-frontend-${var.environment}"
  production_branch = "main"
}

# Note: While Terraform CAN deploy Cloudflare Workers scripts, it is 
# highly recommended to use the Wrangler CLI (wrangler deploy) for 
# the actual deployment of the Worker code itself, as Wrangler natively 
# handles ES module bundling, environment variables, and binding mappings 
# much more effectively for local dev cycles. 
#
# We use Terraform here to provision the *infrastructure backing* the worker.

output "d1_database_id" {
  description = "The ID of the D1 Database to place in wrangler.toml"
  value       = cloudflare_d1_database.main_db.id
}

output "kv_namespace_id" {
  description = "The ID of the KV namespace to place in wrangler.toml"
  value       = cloudflare_workers_kv_namespace.cache_kv.id
}

output "r2_bucket_name" {
  description = "The name of the R2 bucket to place in wrangler.toml"
  value       = cloudflare_r2_bucket.image_bucket.name
}

output "pages_project_name" {
  description = "The name of the Cloudflare Pages project"
  value       = cloudflare_pages_project.frontend.name
}
