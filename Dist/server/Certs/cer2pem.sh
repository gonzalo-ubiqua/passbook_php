FILECER=$1

openssl x509 -inform der -in $FILECER.cer -out $FILECER.pem
#Extract public key
# openssl x509 -inform der -in $FILECER.cer -pubkey -noout > $FILECER-public-key.pem
