# Create a Lambda Layer for sharp
data "archive_file" "sharp_layer" {
  type        = "zip"
  source_dir  = "${path.module}/../sharp"
  output_path = "${path.module}/../sharp.zip"
}

resource "aws_lambda_layer_version" "sharp_layer" {
  layer_name               = "${var.project_name}-sharp-layer-${var.env}"
  compatible_runtimes      = ["nodejs22.x"]
  compatible_architectures = ["x86_64"]
  filename                 = data.archive_file.sharp_layer.output_path
  source_code_hash         = data.archive_file.sharp_layer.output_base64sha256
  description              = "Lambda Layer for sharp library"
}

data "archive_file" "lambda_archive" {
  type        = "zip"
  source_dir  = "${path.module}/../apps/lambda/dist"
  output_path = "${path.module}/../lambda.zip"
}

resource "aws_iam_role" "lambda_exec" {
  name = "${var.project_name}-${var.env}-exec-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      }
    ]
  })
}


# Attach the sharp layer to the Lambda function
resource "aws_lambda_function" "lambda" {
  function_name    = "${var.project_name}-lambda-${var.env}"
  runtime          = "nodejs22.x"
  handler          = "index.handler"
  role             = aws_iam_role.lambda_exec.arn
  filename         = "${path.module}/../lambda.zip"
  source_code_hash = data.archive_file.lambda_archive.output_base64sha256
  timeout          = 10
  description      = "blur hash Lambda ${var.env}"
  memory_size      = 128
  architectures    = ["x86_64"]
  environment {
    variables = {
      DEPLOYED_AT = timestamp()
      DEPLOYED_BY = var.deployed_by
      GIT_SHA     = var.git_sha
    }
  }
  tags = merge(var.tags, {
    Environment = var.env,
  })

  layers = [
    aws_lambda_layer_version.sharp_layer.arn
  ]
}

resource "aws_cloudwatch_log_group" "lambda_logs" {
  name              = "/aws/lambda/${aws_lambda_function.lambda.function_name}"
  retention_in_days = 1
  log_group_class   = "STANDARD"

  tags = {
    Environment = var.env
    Service     = "blurHash"
    s3export    = "true"
  }
}
