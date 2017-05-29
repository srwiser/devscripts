#!/usr/bin/env ruby
name = ARGV.shift
abort "no instance name specified" if not name

def print_instance_data(i)
  name = i.tags.find { |t| t.key == "Name"}.value
  public_ip = i.public_ip_address || "-"
  private_ip = i.private_ip_address || "-"
  printf "%-25s | %-14s | %-14s | %-14s | %-10s | %-8s | %s\n", name, public_ip, private_ip, i.instance_id, i.instance_type, i.state.name, i.placement.availability_zone.gsub("ap-southeast-","")
end

require 'aws-sdk'
ec2 = Aws::EC2::Resource.new(region: 'ap-southeast-1')
result = ec2.instances(
  filters: [ {name: "tag:Name", values:[ name ]} ]
).reject { |i| i.state.name == "terminated" }

result.each { |i| print_instance_data i }