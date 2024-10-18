provider "kubernetes" {
  config_path = "C:\\Users\\alayp\\.kube\\config"  # Point to your kubeconfig file
}

resource "kubernetes_deployment" "grocery_store" {
  metadata {
    name = "grocery-store"
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "grocery-store"
      }
    }

    template {
      metadata {
        labels = {
          app = "grocery-store"
        }
      }

      spec {
        container {
          image = "alay2003/grocery_store:alayp"
          name  = "grocery_store"
          port {
            container_port = 3000
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "grocery_store_service" {
  metadata {
    name = "grocery-store-service"
  }

  spec {
    selector = {
      app = "grocery-store"
    }

    port {
      port        = 80
      target_port = 3000
    }

    type = "NodePort"
  }
}
