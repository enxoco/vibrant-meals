-- MySQL dump 10.13  Distrib 5.7.25, for Linux (x86_64)
--
-- Host: localhost    Database: vibrant_meals
-- ------------------------------------------------------
-- Server version	5.7.25-0ubuntu0.18.10.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `adonis_schema`
--

DROP TABLE IF EXISTS `adonis_schema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `adonis_schema` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `batch` int(11) DEFAULT NULL,
  `migration_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adonis_schema`
--

LOCK TABLES `adonis_schema` WRITE;
/*!40000 ALTER TABLE `adonis_schema` DISABLE KEYS */;
INSERT INTO `adonis_schema` VALUES (76,'1503248427885_user',1,'2019-02-06 17:15:23'),(77,'1503873023555_users_profile_schema',1,'2019-02-06 17:15:23'),(78,'1503873498593_password_resets_schema',1,'2019-02-06 17:15:23'),(79,'1521296001865_change_all_token_to_text_in_user_profile_schema',1,'2019-02-06 17:15:23'),(80,'1542055413400_items_schema',1,'2019-02-06 17:15:24'),(81,'1542055879238_orders_schema',1,'2019-02-06 17:15:24'),(82,'1542056424004_order_items_schema',1,'2019-02-06 17:15:24'),(83,'1542133822307_item_mods_schema',1,'2019-02-06 17:15:24'),(84,'1542407220470_product_images_schema',1,'2019-02-06 17:15:24'),(85,'1543951436551_locations_schema',1,'2019-02-06 17:15:24'),(86,'1544837003456_item_filters_schema',1,'2019-02-06 17:15:24'),(87,'1544888679012_item_categories_schema',1,'2019-02-06 17:15:24'),(88,'1544892638929_items_in_category_schema',1,'2019-02-06 17:15:24'),(89,'1546293713405_items_in_filters_schema',1,'2019-02-06 17:15:24'),(90,'1547681447230_delivery_customer_meta_schema',1,'2019-02-06 17:15:24');
/*!40000 ALTER TABLE `adonis_schema` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_form`
--

DROP TABLE IF EXISTS `contact_form`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contact_form` (
  `id` int(25) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `phone` varchar(200) DEFAULT NULL,
  `referral` text,
  `message` text,
  `read_by_admin` int(1) DEFAULT '0',
  `form_id` varchar(200) DEFAULT NULL,
  `subject` varchar(200) DEFAULT NULL,
  `business` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_form`
--

LOCK TABLES `contact_form` WRITE;
/*!40000 ALTER TABLE `contact_form` DISABLE KEYS */;
INSERT INTO `contact_form` VALUES (1,'Mike Conrad','mkcnrd@gmail.com','(423) 314-5381','Through a friend on Facebook                                            ','This is awesome!  I love vibrant meals!                                                ',0,NULL,NULL,NULL),(2,'Mike Conrad','mkcnrd@gmail.com','(423) 314-5381','I heard about you through a friend on Facebook.                                  ','This is awesome!  Love the site!  Can\'t wait to make my first order...                                      ',0,'contact',NULL,NULL),(3,'Mike Conrad','mkcnrd@gmail.com',NULL,NULL,'I love your site!  Are you guys looking for any help at the moment?                                                  ',0,'careers','Looking for a job',NULL),(4,'Mike Conrad','mkcnrd@gmail.com',NULL,NULL,'We would love to carry vibrant meals in our gym                                                  ',0,'partnerships','Gym',NULL),(5,'Mike Conrad','mkcnrd@gmail.com',NULL,NULL,'We would love to have Vibrant cater our next event.',0,'catering','Catering','Calvary Chatt');
/*!40000 ALTER TABLE `contact_form` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delivery_customer_metas`
--

DROP TABLE IF EXISTS `delivery_customer_metas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `delivery_customer_metas` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `street_addr` varchar(255) DEFAULT NULL,
  `street_addr_2` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `zip` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `delivery_customer_metas_user_id_foreign` (`user_id`),
  CONSTRAINT `delivery_customer_metas_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_customer_metas`
--

LOCK TABLES `delivery_customer_metas` WRITE;
/*!40000 ALTER TABLE `delivery_customer_metas` DISABLE KEYS */;
/*!40000 ALTER TABLE `delivery_customer_metas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_categories`
--

DROP TABLE IF EXISTS `item_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `item_categories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `desc` text,
  `color` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_categories`
--

LOCK TABLES `item_categories` WRITE;
/*!40000 ALTER TABLE `item_categories` DISABLE KEYS */;
INSERT INTO `item_categories` VALUES (1,'Everyday','#AAD0AE',NULL,NULL),(2,'Low Carb','#FED39F',NULL,NULL),(3,'Performance','#D86A6A',NULL,NULL),(4,'Plant Based','#D4C3DF',NULL,NULL),(5,'Breakfast','#F7E393',NULL,NULL);
/*!40000 ALTER TABLE `item_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_filters`
--

DROP TABLE IF EXISTS `item_filters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `item_filters` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_filters`
--

LOCK TABLES `item_filters` WRITE;
/*!40000 ALTER TABLE `item_filters` DISABLE KEYS */;
INSERT INTO `item_filters` VALUES (1,'Keto',NULL,NULL),(2,'Low Carb',NULL,NULL),(3,'Paleo',NULL,NULL),(4,'Plant Based',NULL,NULL);
/*!40000 ALTER TABLE `item_filters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_mods`
--

DROP TABLE IF EXISTS `item_mods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `item_mods` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `itemId` varchar(255) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `mod_category` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_mods`
--

LOCK TABLES `item_mods` WRITE;
/*!40000 ALTER TABLE `item_mods` DISABLE KEYS */;
/*!40000 ALTER TABLE `item_mods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `parent_item` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `sku` varchar(255) DEFAULT NULL,
  `item_category` varchar(255) DEFAULT NULL,
  `item_filter` varchar(255) DEFAULT NULL,
  `description` text,
  `img_url` varchar(255) DEFAULT NULL,
  `alt_img_url` varchar(255) DEFAULT NULL,
  `item_id` int(11) DEFAULT NULL,
  `price` decimal(8,2) DEFAULT NULL,
  `eightySixCount` int(11) DEFAULT NULL,
  `calories` int(11) DEFAULT '0',
  `fats` int(11) DEFAULT '0',
  `carbs` int(11) DEFAULT '0',
  `protein` int(11) DEFAULT '0',
  `sodium` int(11) DEFAULT '0',
  `sugar` int(11) DEFAULT '0',
  `is_keto` tinyint(1) DEFAULT '0',
  `is_whole30` tinyint(1) DEFAULT '0',
  `is_lowCarb` tinyint(1) DEFAULT '0',
  `is_breakfast` tinyint(1) DEFAULT '0',
  `is_paleo` tinyint(1) DEFAULT '0',
  `is_visible` tinyint(1) DEFAULT '1',
  `stripe_id` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (1,NULL,'Eggroll In A Bowl','perfo-eggro_in_a_bowl',NULL,NULL,'Do you love spring rolls? Well, imagine an inside-out spring roll that is actually healthy for you! We bring you the Eggroll in a bowl made with seasoned lean turkey on a bed of cabbage and brown rice stir fry topped with carrots, green onions, aminos and dressed in our special home-made bang bang sauce. Yum.','uploads/item-undefined_Eggroll+In+A+Bowl.jpeg',NULL,NULL,9.75,NULL,0,0,0,0,NULL,NULL,0,0,0,0,0,1,'every-eggro_in_a_bowl',NULL,NULL),(2,NULL,'Noogaroni','sku_EWpDNQjafD94e8',NULL,NULL,'GF Macaroni with  seasoned ground turkey, cured bacon, red onion, celery, scallions, parsley with our vegan chipotle mayo on a bed of kale.','uploads/item-undefined_noogaroni-1.jpeg',NULL,NULL,9.75,NULL,0,0,0,0,NULL,NULL,0,0,0,0,0,1,'every-noogaroni',NULL,NULL),(3,NULL,'Peppercorn Steak Filet','sku_EWpDNQjafD94e8',NULL,NULL,'Peppercorn steak filet, green beans, red potatoes and topped off with a hand crafted peppercorn sauce ; and somehow it\'s still dairy-free!','uploads/item-undefined_peppercorn.jpeg',NULL,NULL,11.50,NULL,0,0,0,0,NULL,NULL,0,0,0,0,0,1,'every-peppe_steak_filet',NULL,NULL),(5,NULL,'Chicken Pot Pie','sku_EWpDNQjafD94e8',NULL,NULL,'Braised chicken with carrots, peas, parsnip, celery, onions and our creamy coconut thyme sauce and homemade gluten free leaves.\r\n\r\n','uploads/item-undefined_potpie.jpeg',NULL,NULL,9.75,NULL,0,0,0,0,NULL,NULL,0,0,0,0,0,1,'low_carb-chick_pot_pie',NULL,NULL),(6,NULL,'Turkey Chilli','sku_EWpDNQjafD94e8',NULL,NULL,'Ground lean turkey, red bell pepper, onion, sweet potatoes, black beans, tomato sauce, white rice, cilantro, lime & spices. ','uploads/item-undefined_Turkey+Chili+2.jpeg',NULL,NULL,9.50,NULL,0,0,0,0,NULL,NULL,0,0,0,0,0,1,'performance-turke_chill',NULL,NULL),(7,NULL,'Paleo American Breakfast','sku_EWpDNQjafD94e8',NULL,NULL,'Gluten free paleo pancake (Cassava Flour, Organic Coconut Flour, Almond Flour, Eggs, Leavening (Monocalcium Phosphate, Sodium Bicarbonate), Salt, Monk Fruit, Spice) with a strawberry compote, scrambled eggs and 2 slices of bacon.\r\n\r\n','uploads/item-undefined_American+Breakfast.jpg',NULL,NULL,8.50,NULL,0,0,0,0,NULL,NULL,0,0,0,0,0,1,'breakfast-paleo_ameri_break',NULL,NULL);
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items_in_categories`
--

DROP TABLE IF EXISTS `items_in_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `items_in_categories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `item_id` int(10) unsigned DEFAULT NULL,
  `category_id` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `items_in_categories_item_id_foreign` (`item_id`),
  KEY `items_in_categories_category_id_foreign` (`category_id`),
  CONSTRAINT `items_in_categories_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `item_categories` (`id`),
  CONSTRAINT `items_in_categories_item_id_foreign` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items_in_categories`
--

LOCK TABLES `items_in_categories` WRITE;
/*!40000 ALTER TABLE `items_in_categories` DISABLE KEYS */;
INSERT INTO `items_in_categories` VALUES (2,2,1,NULL,NULL),(3,3,1,NULL,NULL),(4,5,2,NULL,NULL),(5,6,4,NULL,NULL),(6,7,5,NULL,NULL);
/*!40000 ALTER TABLE `items_in_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items_in_filters`
--

DROP TABLE IF EXISTS `items_in_filters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `items_in_filters` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `item_id` int(10) unsigned DEFAULT NULL,
  `filter_id` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `items_in_filters_item_id_foreign` (`item_id`),
  KEY `items_in_filters_filter_id_foreign` (`filter_id`),
  CONSTRAINT `items_in_filters_filter_id_foreign` FOREIGN KEY (`filter_id`) REFERENCES `item_filters` (`id`),
  CONSTRAINT `items_in_filters_item_id_foreign` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items_in_filters`
--

LOCK TABLES `items_in_filters` WRITE;
/*!40000 ALTER TABLE `items_in_filters` DISABLE KEYS */;
/*!40000 ALTER TABLE `items_in_filters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `locations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `street_addr` varchar(255) DEFAULT NULL,
  `street_addr_sec` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `zip` int(11) DEFAULT NULL,
  `is_active` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `opens` varchar(20) DEFAULT NULL,
  `closes` varchar(20) DEFAULT NULL,
  `coordinates` varchar(255) DEFAULT NULL,
  `location_type` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (12,'Vibrant Meals Kitchen','Vibrant Meals Kitchen','601 Cherokee Blvd',NULL,'Chattanooga','TN',37405,NULL,NULL,NULL,'8:00am','6:30pm','[\"-85.317076\",\"35.068908\"]','Retail'),(13,'Downtown YMCA','Downtown YMCA','301 West 6th Street',NULL,'Chattanooga','TN',37402,NULL,NULL,NULL,'10:00am','8:00pm','[\"-85.312839\",\"35.049675\"]','Pickup'),(14,'Kyle House Fitness','Kyle House Fitness','525 West Main Street',NULL,'Chattanooga','TN',37402,NULL,NULL,NULL,'9:30am','2:30pm','[\"-85.3136527\",\"35.0385917\"]','Pickup'),(15,'Crossfit Brigade East','Crossfit Brigade East','8142 E Brainerd Rd',NULL,'Chattanooga','TN',37421,NULL,NULL,NULL,'4:00pm','7:00pm','[\"-85.1484745\",\"35.0034941\"]','Pickup'),(16,'Burn Bootcamp','Burn Bootcamp','6413 Lee Hwy #113',NULL,'Chattanooga','TN',37421,NULL,NULL,NULL,'4:00pm','7:00pm','[\"-85.1780835\",\"35.0350449\"]','Pickup'),(17,'Body By Hannah','Body By Hannah','282 Church St SE',NULL,'Cleveland','TN',37311,NULL,NULL,NULL,'4:00pm','5:00pm','[\"-84.8762426\",\"35.1575936\"]','Pickup'),(20,'Crossfit Anistemi','Crossfit Anistemi','5806 Waterlevel Hwy',NULL,'Cleveland','TN',37311,NULL,NULL,NULL,'4:00pm','5:00pm','[\"-84.8524849\",\"35.1507661\"]','Pickup');
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `orderId` int(11) DEFAULT NULL,
  `itemId` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `is_paid` tinyint(1) DEFAULT NULL,
  `paid_at` varchar(255) DEFAULT NULL,
  `fulfillment_status` varchar(255) DEFAULT NULL,
  `fulfillment_date` varchar(255) DEFAULT NULL,
  `fulfillment_method` varchar(255) DEFAULT NULL,
  `subtotal` int(11) DEFAULT NULL,
  `shipping` int(11) DEFAULT NULL,
  `taxes` int(11) DEFAULT NULL,
  `total` int(11) DEFAULT NULL,
  `order_id` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_resets` (
  `email` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `password_resets_email_index` (`email`),
  KEY `password_resets_token_index` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_images` (
  `product_image_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `path` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`product_image_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(72) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `pickup_location` varchar(255) DEFAULT NULL,
  `stripe_id` varchar(255) DEFAULT NULL,
  `zip` int(11) DEFAULT NULL,
  `is_guest` int(11) DEFAULT '1',
  `fulfillment_method` varchar(255) DEFAULT NULL,
  `fulfillment_day` varchar(255) DEFAULT NULL,
  `initial_order_completed` int(11) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `user_level` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (12,'mkcnrd@gmail.com','$2a$10$sBur.jeI9irVowSb/0dOi.FMjXryjrrUYqKZwLqurtjUlAGO8xxwC','Mike Conrad',NULL,NULL,NULL,NULL,'cus_EmCqVMzjBNEO9O',NULL,1,'delivery','monday',0,'2019-03-27 12:17:07','2019-03-27 16:05:58','admin');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_profile`
--

DROP TABLE IF EXISTS `users_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_profile` (
  `profile_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `provider_id` varchar(255) DEFAULT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `oauth_token` text,
  `oauth_token_secret` text,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`profile_id`),
  KEY `users_profile_user_id_foreign` (`user_id`),
  CONSTRAINT `users_profile_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_profile`
--

LOCK TABLES `users_profile` WRITE;
/*!40000 ALTER TABLE `users_profile` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_profile` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-04-03 16:21:59
