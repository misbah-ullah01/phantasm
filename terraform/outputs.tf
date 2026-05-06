output "public_ip" {
  description = "Elastic IP assigned to the PHANTASM instance"
  value       = aws_eip.phantasm.public_ip
}

output "ssh_command" {
  description = "SSH command for connecting to the instance"
  value       = "ssh -i ${var.key_name}.pem ubuntu@${aws_eip.phantasm.public_ip}"
}