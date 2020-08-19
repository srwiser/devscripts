modules = open('/Users/srastogi/Desktop/old-jenkins-plugin-list.txt','r')
modules1 = open('/Users/srastogi/Desktop/new-jenkins-plugin-list','r')

modules_list = [];
modules1_list = [];
diff = [];

for line in modules:
 modules_list.append(line.strip())

for line in modules1:
 modules1_list.append(line.strip())

diff = list(set(modules_list)-set(modules1_list))

for item in diff:
 print item+"\n\n"
