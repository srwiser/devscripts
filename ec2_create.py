#!/usr/bin/python
import boto3
import time

ec2 = boto3.resource('ec2', region_name='ap-southeast-1', api_version=None, use_ssl=True, verify=None, endpoint_url=None, aws_access_key_id='AKIAJ5FZ6FXYY52OCEDA', aws_secret_access_key='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', aws_session_token=None, config=None)


# Use boto resources
#for status in ec2.meta.client.describe_instance_status()['InstanceStatuses']:
#    print(status)

#instances = ec2.instances.filter(
#    Filters=[{'Name': 'instance-name', 'Values': ['running']}])
#for instance in instances:
#    print(instance.id, instance.instance_type)


# Launch EC2 Instance
instance = ec2.create_instances(
    ImageId='ami-e90dc68a',
    MinCount=1,
    MaxCount=1,
    KeyName='IREF_new',
    SecurityGroups=[
        'launch-wizard-11',
    ],
    SecurityGroupIds=[
        'sg-1d2f9178',
    ],
    InstanceType='t2.nano',
    Monitoring={
        'Enabled': True
    },
    Placement={
        'AvailabilityZone': 'ap-southeast-1a',
        'Tenancy': 'default',
    },
    InstanceInitiatedShutdownBehavior='stop',
    BlockDeviceMappings=[{"DeviceName": "/dev/xvda","Ebs" : { "VolumeSize" : 30 }}],
)
#time.sleep(10)
#for status in ec2.meta.client.describe_instance_status()['InstanceStatuses']:
#    print(status)
