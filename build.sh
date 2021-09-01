npm --prefix ./renderer run build
go build -o libdicrod.so -buildmode=c-shared main.go
