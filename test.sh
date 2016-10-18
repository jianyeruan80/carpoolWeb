#!/bin/sh
#sed -i 's/173.244.222.167/192.168.1.100/g' /usr/share/app/nginx/permissions/js/app.js
#sed -i 's/173.244.222.167/192.168.1.100/g' /usr/share/app/node/nodeapi/views/js/app.js
#docker exec -it nginx /usr/share/app/nginx/permissions/test.sh
#!/bin/bash

if [ "$1" = "test" ]
then
    echo "test"
    sed -i 's/173.244.222.167/192.168.1.100/g' /usr/share/app/nginx/permissions/js/app.js
    sed -i 's/173.244.222.167/192.168.1.100/g' /usr/share/app/node/nodeapi/views/js/app.js
else
   sed -i 's/192.168.1.100/173.244.222.167/g' /usr/share/app/nginx/permissions/js/app.js
   sed -i 's/192.168.1.100/173.244.222.167/g' /usr/share/app/node/nodeapi/views/js/app.js
fi
# if [ "$1" = "cool" ]
# then
#     echo "Cool Beans"
# elif [ "$1" = "neat" ]
# then
#     echo "Neato cool"
# else
#     echo "Not Cool Beans"
# fi