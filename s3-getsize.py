import boto

#from boto.s3.connection import S3Connection

AWS_KEY = 'AKIAIC2N3DDBVK7BDNHA'
AWS_SECRET = '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'
BUCKET = 'iref-report'

s3 = boto.connect_s3(AWS_KEY, AWS_SECRET)
#client = boto.client('s3', region_name='ap-southeast-1', api_version=None, use_ssl=True, verify=None, endpoint_url=None, aws_access_key_id=AWS_KEY, aws_secret_access_key=AWS_SECRET, aws_session_token=None, config=None)

def get_bucket_size(bucket_name):
    bucket = s3.lookup(bucket_name)
    total_bytes = 0
    n = 0
    for key in bucket:
        total_bytes += key.size
        n += 1
        if n % 2000 == 0:
            print n
    #print total_bytes
    total_gigs = total_bytes/1024/1024/1024
    print "%s: %i GB, %i objects" % (bucket_name, total_gigs, n)
    return total_gigs, n

bucket_list = ['iref-backup']
bucket_sizes = []

for bucket_name in bucket_list:
    size, object_count = get_bucket_size(bucket_name)
    bucket_sizes.append(dict(name=bucket_name, size=size, count=object_count))

print "\nTotals:"
for bucket_size in bucket_sizes:
    print "%s: %iGB, %i objects" % (bucket_size["name"], bucket_size["size"], bucket_size["count"])


