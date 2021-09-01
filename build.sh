go build -o libdicrod.so -buildmode=c-shared main.go

npm --prefix ./renderer run build