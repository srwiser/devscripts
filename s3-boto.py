import boto3

#from boto.s3.connection import S3Connection

AWS_KEY = 'AKIAIC2N3DDBVK7BDNHA'
AWS_SECRET = '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'
REMOTE_FILE = 'images/arrow.png'
LOCAL_FILE = 'arrow2.png'
BUCKET = 'iref-report'

s3 = boto3.resource('s3')
client = boto3.client('s3', region_name='ap-southeast-1', api_version=None, use_ssl=True, verify=None, endpoint_url=None, aws_access_key_id=AWS_KEY, aws_secret_access_key=AWS_SECRET, aws_session_token=None, config=None)

# Use boto resources
#for status in ec2.meta.client.describe_instance_status()['InstanceStatuses']:
#    print(status)

#instances = ec2.instances.filter(
#    Filters=[{'Name': 'instance-state-name', 'Values': ['running']}])
#for instance in instances:
#    print(instance.id, instance.instance_type)

for bucket in boto3.resource('s3', region_name='ap-southeast-1', api_version=None, use_ssl=True, verify=None, endpoint_url=None, aws_access_key_id=AWS_KEY, aws_secret_access_key=AWS_SECRET, aws_session_token=None, config=None).buckets.all():
	print(bucket.name)

client.download_file(BUCKET, REMOTE_FILE, LOCAL_FILE)

#aws_connection = S3Connection(AWS_KEY, AWS_SECRET)
#bucket = aws_connection.get_bucket('yairef')
#for file_key in bucket.list():
#    print file_key.name

