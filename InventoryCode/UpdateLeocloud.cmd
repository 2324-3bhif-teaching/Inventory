kubectl delete -n student-b-wilflingseder deployment Inventory
kubectl delete -n student-b-wilflingseder service Inventory-svc
kubectl delete -n student-b-wilflingseder ingress Inventory-ingress
kubectl delete -n student-b-wilflingseder pod -l app=Inventory
kubectl create -f leocloud-deploy-V2.yml