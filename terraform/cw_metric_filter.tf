resource "aws_cloudwatch_log_metric_filter" "gateway_four_hundred_errors" {
  name           = "4xxErrorsNot404"
  pattern        = "{ $.functionResponseStatus = 4* && $.functionResponseStatus != 404 }"
  log_group_name = aws_cloudwatch_log_group.api_gw.name

  metric_transformation {
    name          = "${var.env}_gateway_4xxErrorsExcluding404"
    namespace     = "ApiGatewayCustom"
    value         = "1"
    unit          = "Count"
    default_value = "0"
  }
}

resource "aws_cloudwatch_log_metric_filter" "gateway_404_errors" {
  name           = "404Errors"
  pattern        = "{ $.functionResponseStatus = 404 }"
  log_group_name = aws_cloudwatch_log_group.api_gw.name

  metric_transformation {
    name          = "${var.env}_gateway_404Errors"
    namespace     = "ApiGatewayCustom"
    value         = "1"
    unit          = "Count"
    default_value = "0"
  }
}
