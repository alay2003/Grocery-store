provider "azurerm" {
  features {}
  subscription_id = "ad315e8a-d837-472e-a73f-2f31f6bafb0a"  # Replace with your actual subscription ID
}

provider "kubernetes" {
  config_path = "C:\\Users\\alayp\\.kube\\config"  # Path to the kubeconfig file
}

resource "azurerm_resource_group" "groceries" {
  name     = "groceriesstore"
  location = "southindia"
}

resource "azurerm_kubernetes_cluster" "devopsweb" {
  name                = "Devopsweb"
  location            = azurerm_resource_group.groceries.location
  resource_group_name = azurerm_resource_group.groceries.name
  dns_prefix          = "devops-groceries"

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_DS2_v2"
  }

  identity {
    type = "SystemAssigned"
  }

  tags = {
    environment = "Dev"
  }
}

resource "kubernetes_deployment" "grocery_store" {
  metadata {
    name      = "grocery-store"
    namespace = "default"
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
          name  = "grocery-store"
          image = "alay2003/grocery_store:alayp"  # Updated to the latest image name
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
    name      = "grocery-store-service"
    namespace = "default"
  }

  spec {
    selector = {
      app = "grocery-store"
    }

    port {
      port        = 80
      target_port = 3000
    }

    type = "LoadBalancer"
  }
}
