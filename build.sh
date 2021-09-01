go build -o libdicrod.so -buildmode=c-shared .

npm --prefix ./renderer run build