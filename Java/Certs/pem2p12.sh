# bo sé si es correcto

FILEPEM=pass.generic.me.123Compare
PK=$FILEPEM-public-key.pem

openssl pkcs12 -export -in $FILEPEM.pem -inkey $PK -out certificate.p12
