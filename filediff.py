modules = open('login_new.php','r')
modules1 = open('login_old.php','r')

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
