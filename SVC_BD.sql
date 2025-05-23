PGDMP  8                    }            tire-fitting    17.4    17.4     r           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            s           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            t           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            u           1262    24576    tire-fitting    DATABASE     t   CREATE DATABASE "tire-fitting" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'ru-RU';
    DROP DATABASE "tire-fitting";
                     postgres    false            �           1247    24780     enum_ConsultationRequests_status    TYPE     �   CREATE TYPE public."enum_ConsultationRequests_status" AS ENUM (
    'запрошена',
    'в работе',
    'проведена',
    'отменена'
);
 5   DROP TYPE public."enum_ConsultationRequests_status";
       public               postgres    false            h           1247    24590 $   enum_EquipmentSellers_specialization    TYPE     �   CREATE TYPE public."enum_EquipmentSellers_specialization" AS ENUM (
    'легковой транспорт',
    'грузовой транспорт',
    'мотоциклы',
    'универсальное оборудование'
);
 9   DROP TYPE public."enum_EquipmentSellers_specialization";
       public               postgres    false            �           1247    24704    enum_Orders_deliveryMethod    TYPE     �   CREATE TYPE public."enum_Orders_deliveryMethod" AS ENUM (
    'самовывоз',
    'транспортная компания',
    'курьер продавца'
);
 /   DROP TYPE public."enum_Orders_deliveryMethod";
       public               postgres    false            �           1247    24692    enum_Orders_status    TYPE     �   CREATE TYPE public."enum_Orders_status" AS ENUM (
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled'
);
 '   DROP TYPE public."enum_Orders_status";
       public               postgres    false            n           1247    24611    enum_Products_condition    TYPE     P   CREATE TYPE public."enum_Products_condition" AS ENUM (
    'new',
    'used'
);
 ,   DROP TYPE public."enum_Products_condition";
       public               postgres    false            q           1247    24616    enum_Products_equipmentType    TYPE     T  CREATE TYPE public."enum_Products_equipmentType" AS ENUM (
    'шиномонтажный стенд',
    'балансировочный стенд',
    'домкрат',
    'компрессор',
    'вулканизатор',
    'инструменты',
    'расходные материалы',
    'подъемники'
);
 0   DROP TYPE public."enum_Products_equipmentType";
       public               postgres    false            t           1247    24634    enum_Products_powerSupply    TYPE     �   CREATE TYPE public."enum_Products_powerSupply" AS ENUM (
    'электрическое',
    'пневматическое',
    'гидравлическое',
    'ручное'
);
 .   DROP TYPE public."enum_Products_powerSupply";
       public               postgres    false            �           1247    24814 $   enum_TechnicalDocuments_documentType    TYPE       CREATE TYPE public."enum_TechnicalDocuments_documentType" AS ENUM (
    'инструкция',
    'паспорт изделия',
    'сертификат соответствия',
    'гарантийный талон',
    'схема подключения'
);
 9   DROP TYPE public."enum_TechnicalDocuments_documentType";
       public               postgres    false            �            1259    24855 	   Analytics    TABLE     z  CREATE TABLE public."Analytics" (
    id integer NOT NULL,
    "equipmentSellerId" integer NOT NULL,
    "productId" integer NOT NULL,
    "totalSales" integer DEFAULT 0 NOT NULL,
    "consultationRequestsCount" integer DEFAULT 0 NOT NULL,
    "averageRating" numeric(3,2),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Analytics";
       public         heap r       postgres    false            �            1259    24854    Analytics_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Analytics_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public."Analytics_id_seq";
       public               postgres    false    240            v           0    0    Analytics_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."Analytics_id_seq" OWNED BY public."Analytics".id;
          public               postgres    false    239            �            1259    24673 	   CartItems    TABLE       CREATE TABLE public."CartItems" (
    id integer NOT NULL,
    "cartId" integer NOT NULL,
    "productId" integer NOT NULL,
    quantity integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."CartItems";
       public         heap r       postgres    false            �            1259    24672    CartItems_id_seq    SEQUENCE     �   CREATE SEQUENCE public."CartItems_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public."CartItems_id_seq";
       public               postgres    false    226            w           0    0    CartItems_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."CartItems_id_seq" OWNED BY public."CartItems".id;
          public               postgres    false    225            �            1259    24661    Carts    TABLE     �   CREATE TABLE public."Carts" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Carts";
       public         heap r       postgres    false            �            1259    24660    Carts_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Carts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public."Carts_id_seq";
       public               postgres    false    224            x           0    0    Carts_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public."Carts_id_seq" OWNED BY public."Carts".id;
          public               postgres    false    223            �            1259    24790    ConsultationRequests    TABLE     �  CREATE TABLE public."ConsultationRequests" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "equipmentSellerId" integer NOT NULL,
    "productId" integer,
    "consultationDate" timestamp with time zone NOT NULL,
    status public."enum_ConsultationRequests_status" NOT NULL,
    "userQuestion" text NOT NULL,
    "sellerResponse" text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
 *   DROP TABLE public."ConsultationRequests";
       public         heap r       postgres    false    911            �            1259    24789    ConsultationRequests_id_seq    SEQUENCE     �   CREATE SEQUENCE public."ConsultationRequests_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public."ConsultationRequests_id_seq";
       public               postgres    false    234            y           0    0    ConsultationRequests_id_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public."ConsultationRequests_id_seq" OWNED BY public."ConsultationRequests".id;
          public               postgres    false    233            �            1259    24600    EquipmentSellers    TABLE       CREATE TABLE public."EquipmentSellers" (
    id integer NOT NULL,
    "companyName" character varying(255) NOT NULL,
    "contactPerson" character varying(255) NOT NULL,
    "registrationNumber" character varying(255) NOT NULL,
    phone character varying(255) NOT NULL,
    description text,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    address character varying(255) NOT NULL,
    logo character varying(255),
    "establishedYear" integer,
    specialization public."enum_EquipmentSellers_specialization" NOT NULL,
    "serviceAvailability" boolean NOT NULL,
    certification character varying(255),
    "serviceArea" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
 &   DROP TABLE public."EquipmentSellers";
       public         heap r       postgres    false    872            �            1259    24599    EquipmentSellers_id_seq    SEQUENCE     �   CREATE SEQUENCE public."EquipmentSellers_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public."EquipmentSellers_id_seq";
       public               postgres    false    220            z           0    0    EquipmentSellers_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public."EquipmentSellers_id_seq" OWNED BY public."EquipmentSellers".id;
          public               postgres    false    219            �            1259    24732 
   OrderItems    TABLE     !  CREATE TABLE public."OrderItems" (
    id integer NOT NULL,
    quantity integer NOT NULL,
    "priceAtPurchase" numeric(10,2) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "orderId" integer,
    "productId" integer
);
     DROP TABLE public."OrderItems";
       public         heap r       postgres    false            �            1259    24731    OrderItems_id_seq    SEQUENCE     �   CREATE SEQUENCE public."OrderItems_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public."OrderItems_id_seq";
       public               postgres    false    230            {           0    0    OrderItems_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public."OrderItems_id_seq" OWNED BY public."OrderItems".id;
          public               postgres    false    229            �            1259    24712    Orders    TABLE     �  CREATE TABLE public."Orders" (
    id integer NOT NULL,
    "deliveryAddress" character varying(255) NOT NULL,
    "totalCost" numeric(10,2) NOT NULL,
    status public."enum_Orders_status" NOT NULL,
    "paymentMethod" character varying(255) NOT NULL,
    "trackingNumber" character varying(255),
    "orderDate" timestamp with time zone NOT NULL,
    "installationRequested" boolean DEFAULT false NOT NULL,
    "deliveryMethod" public."enum_Orders_deliveryMethod" NOT NULL,
    "estimatedDeliveryDate" timestamp with time zone,
    "equipmentSellerId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" integer
);
    DROP TABLE public."Orders";
       public         heap r       postgres    false    899    896            �            1259    24711    Orders_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Orders_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public."Orders_id_seq";
       public               postgres    false    228            |           0    0    Orders_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public."Orders_id_seq" OWNED BY public."Orders".id;
          public               postgres    false    227            �            1259    24644    Products    TABLE     �  CREATE TABLE public."Products" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text NOT NULL,
    price numeric(10,2) NOT NULL,
    category character varying(255) NOT NULL,
    brand character varying(255) NOT NULL,
    model character varying(255),
    condition public."enum_Products_condition" DEFAULT 'new'::public."enum_Products_condition" NOT NULL,
    warranty character varying(255),
    stock integer DEFAULT 0 NOT NULL,
    photo character varying(255),
    documentation character varying(255),
    "equipmentSellerId" integer NOT NULL,
    "equipmentType" public."enum_Products_equipmentType" NOT NULL,
    "powerSupply" public."enum_Products_powerSupply" NOT NULL,
    voltage character varying(255),
    capacity character varying(255),
    "wheelDiameterRange" character varying(255),
    "operatingPressure" character varying(255),
    dimensions character varying(255),
    weight character varying(255),
    "countryOfOrigin" character varying(255),
    "installationRequired" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Products";
       public         heap r       postgres    false    878    878    884    881            �            1259    24643    Products_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Products_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public."Products_id_seq";
       public               postgres    false    222            }           0    0    Products_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public."Products_id_seq" OWNED BY public."Products".id;
          public               postgres    false    221            �            1259    24751    Reviews    TABLE       CREATE TABLE public."Reviews" (
    id integer NOT NULL,
    rating integer NOT NULL,
    "shortReview" character varying(255) NOT NULL,
    "reviewText" text,
    "userId" integer NOT NULL,
    "orderId" integer NOT NULL,
    "equipmentSellerId" integer NOT NULL,
    "productId" integer,
    "easeOfInstallation" integer,
    "buildQuality" integer,
    "technicalSupport" integer,
    "valueForMoney" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Reviews";
       public         heap r       postgres    false            �            1259    24750    Reviews_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Reviews_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public."Reviews_id_seq";
       public               postgres    false    232            ~           0    0    Reviews_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Reviews_id_seq" OWNED BY public."Reviews".id;
          public               postgres    false    231            �            1259    24826    TechnicalDocuments    TABLE     E  CREATE TABLE public."TechnicalDocuments" (
    id integer NOT NULL,
    "productId" integer NOT NULL,
    "documentType" public."enum_TechnicalDocuments_documentType" NOT NULL,
    "filePath" character varying(255) NOT NULL,
    language character varying(255) NOT NULL,
    "uploadedAt" timestamp with time zone NOT NULL
);
 (   DROP TABLE public."TechnicalDocuments";
       public         heap r       postgres    false    917            �            1259    24825    TechnicalDocuments_id_seq    SEQUENCE     �   CREATE SEQUENCE public."TechnicalDocuments_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public."TechnicalDocuments_id_seq";
       public               postgres    false    236                       0    0    TechnicalDocuments_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public."TechnicalDocuments_id_seq" OWNED BY public."TechnicalDocuments".id;
          public               postgres    false    235            �            1259    24578    Users    TABLE     1  CREATE TABLE public."Users" (
    id integer NOT NULL,
    "firstName" character varying(255) NOT NULL,
    "lastName" character varying(255) NOT NULL,
    phone character varying(255) NOT NULL,
    "birthDate" timestamp with time zone,
    address character varying(255),
    description text,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    photo character varying(255),
    points integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Users";
       public         heap r       postgres    false            �            1259    24577    Users_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public."Users_id_seq";
       public               postgres    false    218            �           0    0    Users_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;
          public               postgres    false    217            �            1259    24840    WarrantyServices    TABLE     �  CREATE TABLE public."WarrantyServices" (
    id integer NOT NULL,
    "orderItemId" integer NOT NULL,
    "warrantyPeriod" character varying(255) NOT NULL,
    "serviceConditions" text NOT NULL,
    "serviceCenterContacts" character varying(255) NOT NULL,
    "validUntil" timestamp with time zone NOT NULL,
    "isExtendedWarranty" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
 &   DROP TABLE public."WarrantyServices";
       public         heap r       postgres    false            �            1259    24839    WarrantyServices_id_seq    SEQUENCE     �   CREATE SEQUENCE public."WarrantyServices_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public."WarrantyServices_id_seq";
       public               postgres    false    238            �           0    0    WarrantyServices_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public."WarrantyServices_id_seq" OWNED BY public."WarrantyServices".id;
          public               postgres    false    237            �           2604    24858    Analytics id    DEFAULT     p   ALTER TABLE ONLY public."Analytics" ALTER COLUMN id SET DEFAULT nextval('public."Analytics_id_seq"'::regclass);
 =   ALTER TABLE public."Analytics" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    239    240    240            x           2604    24676    CartItems id    DEFAULT     p   ALTER TABLE ONLY public."CartItems" ALTER COLUMN id SET DEFAULT nextval('public."CartItems_id_seq"'::regclass);
 =   ALTER TABLE public."CartItems" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    225    226    226            w           2604    24664    Carts id    DEFAULT     h   ALTER TABLE ONLY public."Carts" ALTER COLUMN id SET DEFAULT nextval('public."Carts_id_seq"'::regclass);
 9   ALTER TABLE public."Carts" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    224    223    224            }           2604    24793    ConsultationRequests id    DEFAULT     �   ALTER TABLE ONLY public."ConsultationRequests" ALTER COLUMN id SET DEFAULT nextval('public."ConsultationRequests_id_seq"'::regclass);
 H   ALTER TABLE public."ConsultationRequests" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    234    233    234            r           2604    24603    EquipmentSellers id    DEFAULT     ~   ALTER TABLE ONLY public."EquipmentSellers" ALTER COLUMN id SET DEFAULT nextval('public."EquipmentSellers_id_seq"'::regclass);
 D   ALTER TABLE public."EquipmentSellers" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    220    219    220            {           2604    24735    OrderItems id    DEFAULT     r   ALTER TABLE ONLY public."OrderItems" ALTER COLUMN id SET DEFAULT nextval('public."OrderItems_id_seq"'::regclass);
 >   ALTER TABLE public."OrderItems" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    230    229    230            y           2604    24715 	   Orders id    DEFAULT     j   ALTER TABLE ONLY public."Orders" ALTER COLUMN id SET DEFAULT nextval('public."Orders_id_seq"'::regclass);
 :   ALTER TABLE public."Orders" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    228    227    228            s           2604    24647    Products id    DEFAULT     n   ALTER TABLE ONLY public."Products" ALTER COLUMN id SET DEFAULT nextval('public."Products_id_seq"'::regclass);
 <   ALTER TABLE public."Products" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    221    222    222            |           2604    24754 
   Reviews id    DEFAULT     l   ALTER TABLE ONLY public."Reviews" ALTER COLUMN id SET DEFAULT nextval('public."Reviews_id_seq"'::regclass);
 ;   ALTER TABLE public."Reviews" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    231    232    232            ~           2604    24829    TechnicalDocuments id    DEFAULT     �   ALTER TABLE ONLY public."TechnicalDocuments" ALTER COLUMN id SET DEFAULT nextval('public."TechnicalDocuments_id_seq"'::regclass);
 F   ALTER TABLE public."TechnicalDocuments" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    235    236    236            p           2604    24581    Users id    DEFAULT     h   ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);
 9   ALTER TABLE public."Users" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    218    217    218                       2604    24843    WarrantyServices id    DEFAULT     ~   ALTER TABLE ONLY public."WarrantyServices" ALTER COLUMN id SET DEFAULT nextval('public."WarrantyServices_id_seq"'::regclass);
 D   ALTER TABLE public."WarrantyServices" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    238    237    238            o          0    24855 	   Analytics 
   TABLE DATA           �   COPY public."Analytics" (id, "equipmentSellerId", "productId", "totalSales", "consultationRequestsCount", "averageRating", "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    240   $�       a          0    24673 	   CartItems 
   TABLE DATA           d   COPY public."CartItems" (id, "cartId", "productId", quantity, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    226   A�       _          0    24661    Carts 
   TABLE DATA           I   COPY public."Carts" (id, "userId", "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    224   ^�       i          0    24790    ConsultationRequests 
   TABLE DATA           �   COPY public."ConsultationRequests" (id, "userId", "equipmentSellerId", "productId", "consultationDate", status, "userQuestion", "sellerResponse", "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    234   ��       [          0    24600    EquipmentSellers 
   TABLE DATA             COPY public."EquipmentSellers" (id, "companyName", "contactPerson", "registrationNumber", phone, description, email, password, address, logo, "establishedYear", specialization, "serviceAvailability", certification, "serviceArea", "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    220   ��       e          0    24732 
   OrderItems 
   TABLE DATA           y   COPY public."OrderItems" (id, quantity, "priceAtPurchase", "createdAt", "updatedAt", "orderId", "productId") FROM stdin;
    public               postgres    false    230   ��       c          0    24712    Orders 
   TABLE DATA           �   COPY public."Orders" (id, "deliveryAddress", "totalCost", status, "paymentMethod", "trackingNumber", "orderDate", "installationRequested", "deliveryMethod", "estimatedDeliveryDate", "equipmentSellerId", "createdAt", "updatedAt", "userId") FROM stdin;
    public               postgres    false    228   U�       ]          0    24644    Products 
   TABLE DATA           X  COPY public."Products" (id, name, description, price, category, brand, model, condition, warranty, stock, photo, documentation, "equipmentSellerId", "equipmentType", "powerSupply", voltage, capacity, "wheelDiameterRange", "operatingPressure", dimensions, weight, "countryOfOrigin", "installationRequired", "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    222   ��       g          0    24751    Reviews 
   TABLE DATA           �   COPY public."Reviews" (id, rating, "shortReview", "reviewText", "userId", "orderId", "equipmentSellerId", "productId", "easeOfInstallation", "buildQuality", "technicalSupport", "valueForMoney", "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    232   ��       k          0    24826    TechnicalDocuments 
   TABLE DATA           s   COPY public."TechnicalDocuments" (id, "productId", "documentType", "filePath", language, "uploadedAt") FROM stdin;
    public               postgres    false    236   ��       Y          0    24578    Users 
   TABLE DATA           �   COPY public."Users" (id, "firstName", "lastName", phone, "birthDate", address, description, email, password, photo, points, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    218   ��       m          0    24840    WarrantyServices 
   TABLE DATA           �   COPY public."WarrantyServices" (id, "orderItemId", "warrantyPeriod", "serviceConditions", "serviceCenterContacts", "validUntil", "isExtendedWarranty", "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    238   ��       �           0    0    Analytics_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."Analytics_id_seq"', 1, false);
          public               postgres    false    239            �           0    0    CartItems_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."CartItems_id_seq"', 9, true);
          public               postgres    false    225            �           0    0    Carts_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public."Carts_id_seq"', 3, true);
          public               postgres    false    223            �           0    0    ConsultationRequests_id_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public."ConsultationRequests_id_seq"', 8, true);
          public               postgres    false    233            �           0    0    EquipmentSellers_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public."EquipmentSellers_id_seq"', 3, true);
          public               postgres    false    219            �           0    0    OrderItems_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."OrderItems_id_seq"', 8, true);
          public               postgres    false    229            �           0    0    Orders_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public."Orders_id_seq"', 8, true);
          public               postgres    false    227            �           0    0    Products_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Products_id_seq"', 52, true);
          public               postgres    false    221            �           0    0    Reviews_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Reviews_id_seq"', 1, false);
          public               postgres    false    231            �           0    0    TechnicalDocuments_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public."TechnicalDocuments_id_seq"', 1, false);
          public               postgres    false    235            �           0    0    Users_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public."Users_id_seq"', 3, true);
          public               postgres    false    217            �           0    0    WarrantyServices_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public."WarrantyServices_id_seq"', 1, false);
          public               postgres    false    237            �           2606    24862    Analytics Analytics_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public."Analytics"
    ADD CONSTRAINT "Analytics_pkey" PRIMARY KEY (id);
 F   ALTER TABLE ONLY public."Analytics" DROP CONSTRAINT "Analytics_pkey";
       public                 postgres    false    240            �           2606    24680 (   CartItems CartItems_cartId_productId_key 
   CONSTRAINT     x   ALTER TABLE ONLY public."CartItems"
    ADD CONSTRAINT "CartItems_cartId_productId_key" UNIQUE ("cartId", "productId");
 V   ALTER TABLE ONLY public."CartItems" DROP CONSTRAINT "CartItems_cartId_productId_key";
       public                 postgres    false    226    226            �           2606    24678    CartItems CartItems_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public."CartItems"
    ADD CONSTRAINT "CartItems_pkey" PRIMARY KEY (id);
 F   ALTER TABLE ONLY public."CartItems" DROP CONSTRAINT "CartItems_pkey";
       public                 postgres    false    226            �           2606    24666    Carts Carts_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Carts"
    ADD CONSTRAINT "Carts_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Carts" DROP CONSTRAINT "Carts_pkey";
       public                 postgres    false    224            �           2606    24797 .   ConsultationRequests ConsultationRequests_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public."ConsultationRequests"
    ADD CONSTRAINT "ConsultationRequests_pkey" PRIMARY KEY (id);
 \   ALTER TABLE ONLY public."ConsultationRequests" DROP CONSTRAINT "ConsultationRequests_pkey";
       public                 postgres    false    234            �           2606    41277 +   EquipmentSellers EquipmentSellers_email_key 
   CONSTRAINT     k   ALTER TABLE ONLY public."EquipmentSellers"
    ADD CONSTRAINT "EquipmentSellers_email_key" UNIQUE (email);
 Y   ALTER TABLE ONLY public."EquipmentSellers" DROP CONSTRAINT "EquipmentSellers_email_key";
       public                 postgres    false    220            �           2606    41279 ,   EquipmentSellers EquipmentSellers_email_key1 
   CONSTRAINT     l   ALTER TABLE ONLY public."EquipmentSellers"
    ADD CONSTRAINT "EquipmentSellers_email_key1" UNIQUE (email);
 Z   ALTER TABLE ONLY public."EquipmentSellers" DROP CONSTRAINT "EquipmentSellers_email_key1";
       public                 postgres    false    220            �           2606    41281 ,   EquipmentSellers EquipmentSellers_email_key2 
   CONSTRAINT     l   ALTER TABLE ONLY public."EquipmentSellers"
    ADD CONSTRAINT "EquipmentSellers_email_key2" UNIQUE (email);
 Z   ALTER TABLE ONLY public."EquipmentSellers" DROP CONSTRAINT "EquipmentSellers_email_key2";
       public                 postgres    false    220            �           2606    41283 ,   EquipmentSellers EquipmentSellers_email_key3 
   CONSTRAINT     l   ALTER TABLE ONLY public."EquipmentSellers"
    ADD CONSTRAINT "EquipmentSellers_email_key3" UNIQUE (email);
 Z   ALTER TABLE ONLY public."EquipmentSellers" DROP CONSTRAINT "EquipmentSellers_email_key3";
       public                 postgres    false    220            �           2606    41275 ,   EquipmentSellers EquipmentSellers_email_key4 
   CONSTRAINT     l   ALTER TABLE ONLY public."EquipmentSellers"
    ADD CONSTRAINT "EquipmentSellers_email_key4" UNIQUE (email);
 Z   ALTER TABLE ONLY public."EquipmentSellers" DROP CONSTRAINT "EquipmentSellers_email_key4";
       public                 postgres    false    220            �           2606    24607 &   EquipmentSellers EquipmentSellers_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public."EquipmentSellers"
    ADD CONSTRAINT "EquipmentSellers_pkey" PRIMARY KEY (id);
 T   ALTER TABLE ONLY public."EquipmentSellers" DROP CONSTRAINT "EquipmentSellers_pkey";
       public                 postgres    false    220            �           2606    24739 +   OrderItems OrderItems_orderId_productId_key 
   CONSTRAINT     |   ALTER TABLE ONLY public."OrderItems"
    ADD CONSTRAINT "OrderItems_orderId_productId_key" UNIQUE ("orderId", "productId");
 Y   ALTER TABLE ONLY public."OrderItems" DROP CONSTRAINT "OrderItems_orderId_productId_key";
       public                 postgres    false    230    230            �           2606    24737    OrderItems OrderItems_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public."OrderItems"
    ADD CONSTRAINT "OrderItems_pkey" PRIMARY KEY (id);
 H   ALTER TABLE ONLY public."OrderItems" DROP CONSTRAINT "OrderItems_pkey";
       public                 postgres    false    230            �           2606    24720    Orders Orders_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY public."Orders" DROP CONSTRAINT "Orders_pkey";
       public                 postgres    false    228            �           2606    24654    Products Products_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Products" DROP CONSTRAINT "Products_pkey";
       public                 postgres    false    222            �           2606    24758    Reviews Reviews_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."Reviews"
    ADD CONSTRAINT "Reviews_pkey" PRIMARY KEY (id);
 B   ALTER TABLE ONLY public."Reviews" DROP CONSTRAINT "Reviews_pkey";
       public                 postgres    false    232            �           2606    24833 *   TechnicalDocuments TechnicalDocuments_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public."TechnicalDocuments"
    ADD CONSTRAINT "TechnicalDocuments_pkey" PRIMARY KEY (id);
 X   ALTER TABLE ONLY public."TechnicalDocuments" DROP CONSTRAINT "TechnicalDocuments_pkey";
       public                 postgres    false    236            �           2606    41263    Users Users_email_key 
   CONSTRAINT     U   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);
 C   ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key";
       public                 postgres    false    218            �           2606    41265    Users Users_email_key1 
   CONSTRAINT     V   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key1" UNIQUE (email);
 D   ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key1";
       public                 postgres    false    218            �           2606    41267    Users Users_email_key2 
   CONSTRAINT     V   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key2" UNIQUE (email);
 D   ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key2";
       public                 postgres    false    218            �           2606    41269    Users Users_email_key3 
   CONSTRAINT     V   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key3" UNIQUE (email);
 D   ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key3";
       public                 postgres    false    218            �           2606    41261    Users Users_email_key4 
   CONSTRAINT     V   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key4" UNIQUE (email);
 D   ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key4";
       public                 postgres    false    218            �           2606    24586    Users Users_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_pkey";
       public                 postgres    false    218            �           2606    24848 &   WarrantyServices WarrantyServices_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public."WarrantyServices"
    ADD CONSTRAINT "WarrantyServices_pkey" PRIMARY KEY (id);
 T   ALTER TABLE ONLY public."WarrantyServices" DROP CONSTRAINT "WarrantyServices_pkey";
       public                 postgres    false    238            �           2606    41379 *   Analytics Analytics_equipmentSellerId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Analytics"
    ADD CONSTRAINT "Analytics_equipmentSellerId_fkey" FOREIGN KEY ("equipmentSellerId") REFERENCES public."EquipmentSellers"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 X   ALTER TABLE ONLY public."Analytics" DROP CONSTRAINT "Analytics_equipmentSellerId_fkey";
       public               postgres    false    4763    220    240            �           2606    41384 "   Analytics Analytics_productId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Analytics"
    ADD CONSTRAINT "Analytics_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Products"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 P   ALTER TABLE ONLY public."Analytics" DROP CONSTRAINT "Analytics_productId_fkey";
       public               postgres    false    4765    222    240            �           2606    41300    CartItems CartItems_cartId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."CartItems"
    ADD CONSTRAINT "CartItems_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES public."Carts"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 M   ALTER TABLE ONLY public."CartItems" DROP CONSTRAINT "CartItems_cartId_fkey";
       public               postgres    false    4767    226    224            �           2606    41305 "   CartItems CartItems_productId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."CartItems"
    ADD CONSTRAINT "CartItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Products"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 P   ALTER TABLE ONLY public."CartItems" DROP CONSTRAINT "CartItems_productId_fkey";
       public               postgres    false    4765    222    226            �           2606    41295    Carts Carts_userId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Carts"
    ADD CONSTRAINT "Carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 E   ALTER TABLE ONLY public."Carts" DROP CONSTRAINT "Carts_userId_fkey";
       public               postgres    false    224    4751    218            �           2606    41357 @   ConsultationRequests ConsultationRequests_equipmentSellerId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."ConsultationRequests"
    ADD CONSTRAINT "ConsultationRequests_equipmentSellerId_fkey" FOREIGN KEY ("equipmentSellerId") REFERENCES public."EquipmentSellers"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 n   ALTER TABLE ONLY public."ConsultationRequests" DROP CONSTRAINT "ConsultationRequests_equipmentSellerId_fkey";
       public               postgres    false    234    220    4763            �           2606    41362 8   ConsultationRequests ConsultationRequests_productId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."ConsultationRequests"
    ADD CONSTRAINT "ConsultationRequests_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Products"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 f   ALTER TABLE ONLY public."ConsultationRequests" DROP CONSTRAINT "ConsultationRequests_productId_fkey";
       public               postgres    false    4765    222    234            �           2606    41352 5   ConsultationRequests ConsultationRequests_userId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."ConsultationRequests"
    ADD CONSTRAINT "ConsultationRequests_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 c   ALTER TABLE ONLY public."ConsultationRequests" DROP CONSTRAINT "ConsultationRequests_userId_fkey";
       public               postgres    false    4751    234    218            �           2606    41322 "   OrderItems OrderItems_orderId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."OrderItems"
    ADD CONSTRAINT "OrderItems_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Orders"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 P   ALTER TABLE ONLY public."OrderItems" DROP CONSTRAINT "OrderItems_orderId_fkey";
       public               postgres    false    228    4773    230            �           2606    41327 $   OrderItems OrderItems_productId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."OrderItems"
    ADD CONSTRAINT "OrderItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Products"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 R   ALTER TABLE ONLY public."OrderItems" DROP CONSTRAINT "OrderItems_productId_fkey";
       public               postgres    false    230    222    4765            �           2606    41312 $   Orders Orders_equipmentSellerId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_equipmentSellerId_fkey" FOREIGN KEY ("equipmentSellerId") REFERENCES public."EquipmentSellers"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 R   ALTER TABLE ONLY public."Orders" DROP CONSTRAINT "Orders_equipmentSellerId_fkey";
       public               postgres    false    4763    220    228            �           2606    41317    Orders Orders_userId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 G   ALTER TABLE ONLY public."Orders" DROP CONSTRAINT "Orders_userId_fkey";
       public               postgres    false    218    4751    228            �           2606    41288 (   Products Products_equipmentSellerId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_equipmentSellerId_fkey" FOREIGN KEY ("equipmentSellerId") REFERENCES public."EquipmentSellers"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 V   ALTER TABLE ONLY public."Products" DROP CONSTRAINT "Products_equipmentSellerId_fkey";
       public               postgres    false    220    4763    222            �           2606    41342 &   Reviews Reviews_equipmentSellerId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Reviews"
    ADD CONSTRAINT "Reviews_equipmentSellerId_fkey" FOREIGN KEY ("equipmentSellerId") REFERENCES public."EquipmentSellers"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 T   ALTER TABLE ONLY public."Reviews" DROP CONSTRAINT "Reviews_equipmentSellerId_fkey";
       public               postgres    false    4763    220    232            �           2606    41337    Reviews Reviews_orderId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Reviews"
    ADD CONSTRAINT "Reviews_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Orders"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 J   ALTER TABLE ONLY public."Reviews" DROP CONSTRAINT "Reviews_orderId_fkey";
       public               postgres    false    4773    232    228            �           2606    41347    Reviews Reviews_productId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Reviews"
    ADD CONSTRAINT "Reviews_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Products"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 L   ALTER TABLE ONLY public."Reviews" DROP CONSTRAINT "Reviews_productId_fkey";
       public               postgres    false    232    4765    222            �           2606    41332    Reviews Reviews_userId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Reviews"
    ADD CONSTRAINT "Reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 I   ALTER TABLE ONLY public."Reviews" DROP CONSTRAINT "Reviews_userId_fkey";
       public               postgres    false    232    4751    218            �           2606    41367 4   TechnicalDocuments TechnicalDocuments_productId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."TechnicalDocuments"
    ADD CONSTRAINT "TechnicalDocuments_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Products"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 b   ALTER TABLE ONLY public."TechnicalDocuments" DROP CONSTRAINT "TechnicalDocuments_productId_fkey";
       public               postgres    false    236    222    4765            �           2606    41372 2   WarrantyServices WarrantyServices_orderItemId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."WarrantyServices"
    ADD CONSTRAINT "WarrantyServices_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES public."OrderItems"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 `   ALTER TABLE ONLY public."WarrantyServices" DROP CONSTRAINT "WarrantyServices_orderItemId_fkey";
       public               postgres    false    230    238    4777            o      x������ � �      a      x������ � �      _   O   x�}˻�0�ڞ"=���2�%��A���@ S˩1�qu��P�!6��c�g�Jxn�C�s�V[�V��N���oD �      i   �  x���KN�0���)�G��llo�'�a�� �
��7(��!4��7b�"Z�JG�O<_f~"�$C"�4�\1�<�x�qE`؆1t�*haA��7��S�a�f-��b�Ø?��5~�[�3\�m���⫤�LHo�7eQ:��,Q���W����T���hol�<��.Q� �R��|Jt�aW�a�DU�2\�0��%�w��9�=f�L���E��u^�B�9ܞD5�JR�q�I��T���;���FP���p	uTh�sE��5�����f���kS8%���5	Z|���п�q��l�!��:�X�u!�a��'�!Qx�/�y/�l�������x���[{n�Q����D˄�{�vu�N�``+�c��3V?����˰�$j�L�O9}pv�5�e
�������^��Z{Lҗ訠�~ A�$      [     x��T[S�@~^~E|�M7	!	OU[DQҪX���MDE.�>I��8:�L}h���t�� "�����g7REG;��,�d�~�sP|�t�
�p	m�I!���]��0L�����ӀE-B�[��rfeum�y&Ϯ��|���!E��+��JqT)�;�Xt��tt�R(eM�.[��ې�y�M��MYS�J)� �ol�}�K�\W�,E�b��4��X��%�pxpɪ��v�C��4Y�@�~p�gx�\�V��o�Q��?����&Q�A͐M���#)�Jf�8��o��C-��~�k�~#��:^��:�"K�������`�8��1�8����%,�5�uzu��Y?ۃ!��
���.O5$� s?W��ib�� ��}����B���W
�Dt>1����阙��I����q��Hd'�b�4_(��z&c�"��`u�	��%����B3���qcU���w8�C�#����B��g�5��?���R� ��:�Kp�/)�҃�*+���a�s���\�;�8-�`Q�6��5��k�ɚ��-�嶑�����֛[�b���Y
'\v$�Dkp�`��[�Y!�+�T��E=F��8^Ku0��U`�V������e�H�7���T$�(��26igb�������rfkkC��撑�>6��73��+Ȋ9t���/T��p�b<��\2U�r��/M����YD���޿#>L8{�e]h��Q����*jaQ�ˇ�h-�������`ʷ$�|��ZQ�c      e   �   x�}�;!E��^E�h,1����n&Xih�t􌀀dg&fPָ�/���d����o�I���WB*&�u��y$�1Yc�9cz�nQ8�d�� �COHr�Qf��#9$��.+�19i��=-�vZ���^�N�����`.��)<E)l��#%xb_�k�����ŠG�0�C��N"g�      c   '  x���ϊ�@�ϝ���&tu�߼��E<zY��,�xg@�œ �o av#qvg�����8�Ivg���K��ꗪ��.�:��w�/����	}���*O� �,�/=zv�T�W��[��*��sj&t���✕��o�����i��� ��(#-
%�ɥΕ� �R��
pG�x)��*��,�4��qh�;��b����_7�l#�Hj�?��f	2��h>s�N��N�-���$�Zz3�cJ��)�AK�9����ߘ/ؾ�EJ��կ=��w%�p����3z�A��J4r0��,�3��[$��-l>��i��u"p�H�J���mv�E,��g�S���H����[t���08�Rc���\��02})3��Ó���%h�εR�Ö�PJW��/2]�mRfo!�-�s���A���y|���A�uJ�0jA�-��w�_�N��taG���qH�����ѣ|�JP|��Av�%���=a��ױ�$��H�4��{�_>��N�g�� ˣ���[$�Y����k      ]      x��]Yoו~.��B�$��U{W3O^G��d$c� ��d���(�ғHZ�<�M[v0�my�L2�l��&���?P��K�l�֭�I�J�b��U}�s���^yV򧤟�Q2���㍤�<�?�'{�x�~Ň�v������ �%��}��;�?�c�]x���m�{V��z0�4w����n����������}��u�>}�;IWf\��L�I^�A�Cj�u�n���5z0�o�o�І�W�xܰ��w?����}?�xm~�r����`�#�k:����	M��u�&����G�<����F�9��|=��n�4�A��l����2A{�0���1���65���{z�� ^���ð���C���K<��'�x4~O�e`��/?�&�u�a[�f�ǩ��W��Ǯwx��E��]�hW����������:�%]˳N]�zyyv�ک�+���W��r�A��﷢�;3;���7D�0��[��0��ۼ��텸�pc�Y����x��E�ס�ä7j��V� ;���2��rk.n���| �9�(٣&����0����Պ�5�υ1��L�J����=k��/�;A��mϝ�i��h5�_8��GS��Ӂ!�j���>�ڎ`���m����m�.���݀ q�8�����.=\�\�Ԏ:�Z��6��:�^������o��v�O��c�FO�5z	�ԥm��둂"�ֺ8��G_��3ax4
A^���?	���`=3��^�'����E͔m���8~X�������'��7���.}[Tv�G+�!��:�3~� ���B �-�&Vp���C��*J�U��_	���3^��n�^�n�{�B��0����qZ�������Bh��~�f.\p/@csA��b'�oE��J��� �����Ʃy�5��V��bM����<����%X�yI�$���n���p����tKo*���;����D)�������YE�Nد����/�>��Do�;9���/4�F��XY�`G=���w��'�e��2�=uC5@s���C�<4-�I�P6ԃu�;��ݷV�Z������a����>���$�����'�x�~AV�$���p|��5$�B���g��6�Bl��e8#��׿�}%����ǅ�N���r���ţ���E��1% }BA�m��(�]��Y�N�����d;��+`S�U���q={ĝ���I�l�	bw��Cz�!�6�����ۄ�}���[d�2�_i]�EVG�נ����]���YD̅FR����+,�.�B2�\X#��Y�Z�%�X��n��n^3�Y�6?��Q�¥�@r�����	\ ��?G�BU/�5��aQ���s�<�^H�3 �a�	�ݠAS���	>��� eOȰ��� ��L�{D��O2ҵ�����bzve����˗�����z�����v�X�'�|G�6W����Z�M��GC����Aۄvh@����tW�4�}���DV��������jX�bV��`U���z�̍����v4�8W�K�z@$ȑ��a��T-�W��:�fL.(�a�6����9�]x4�׊��`�R<�űTBK�XZm�_����*�����A4�]2ͯt*�x�6=[Wc��!��o�4�'d6.n0J�K�۬���A��ßUkKW�A�ѥ�I1PIh��&*��;?��h�k�T��!�o��w��F����YeK�!���!�T���NC���`U���w�9���ɗ�YA�pbļ����чN6�l����̐�bl�j(0O�f1�#2�#ea@y�Q�H�o 4s���գ�����i��;>Q,JK�3xCN��/$ ٤�h-*�rF�vm���fj������a�Y,ZV�%@t�zRg��,�3�0��&R0.C=Ҿ��gbpH)a�w$V՛hǶi9Ѫu�[�IYve0Ôd��B��D#Im�m��N������jH���:�цx�:��LÐ�o�߃�~R�?��w���b}�)��2l�o�diF
c|�1�e��hR�d`�d�v�d��d��&�����T��|���޾�T�<x�t
w���
�'޾����7���YX��g6K;�(t����k	�ҖG��8��t�w☦Y���:�"�����D�:�w\ŏP���c��>��dN��☧�}q����C�-���\�W�5��O����'�B	K�lj޽	�E�=�S��M6g���=F�9���EU ��3L_> @�Z�%�U�=����%}�Cj��z�� �<�73`����}�"La�0�����O���j�u�&����]rM�B.@��w���!C=&Q �ʿ-E|�o�9�s�7���y�q�r�3�h���pm׷I���%��Qy��y)�{v���ҭ���P,$��;I��(�8yǠ�ڹc2g]��^8�s��q������pqum��wf��Z��-\��x�µ��E����g��ԔU��
��^�Z	���0b��7�f	�6M0��%q�gP�謩k&~
w8֬�#Eۿ;b����>��n_���q�0G6eȎ0��&�Iq��46�P��Y3�}����=
�����h��-B��D�v�^*���0T�����x��Bئ��u)bE����i��k�7������J�]���,B�D8͞pB��>K�!�)!�ܕ`Ў�.��qT��u`�ۼ%��p���]Z2�=�ya~İjFB�v��1/�-y;/>AQF+Mdez��B��(�TIL1�г�[Z�����q���ٕ̕U�V'��quI�G�p 1�oᯊ�[���t�<L4-\�֬���� ���F�xy��>�
~J�h#���J��IG�q�l��4�0�r�D�l2Y�|�#Tft�_���2�+!�ť��l��ƌQ�>��7	j?Fqk�=���e��2qԵ����-��?��X������	����ƃ����ǡ�dx�;������]����=�ڙT�o��JuF�:�ݕh�>�6�2ɬ� �$Ab ��B��˹�j3EQ���]M�<��D]�Y�
+}�<��n^��V�����	v��d��L�M�q���P�~���V3lM���U�m���F/�
5V�5���iy�7�ƭ�?s�Zs�����v#O���X� A��ͥ�: �^�z&D]gB6�����Ǡ��>���}��6��=9�R����-Λ�er�(=@��6�<f\�_y�t���� ~���U��f�N3��@�*��)��F:�G:<0�TS��Bl(�����@�S�����:1�who��
L,ێ�/�lU�@��`s����l:��m����s�s�Y�_��QʔB҇���ohA�DF�*JIY�<uߡ��2k�>o؎ڄ�!�IU
�ؤෙ�g�a�&Cu�Šf�%�/BA֧�'�R��^��Ҍ�|_�4����W������?S!�\�i=�N��4��J���'��U�����~���4o�\z��i�R�~�72��g�G�����yQ��ާ!�s^�����;:?Yƕ�@����[e�]�N6,��(јüfP'+�7!*�����ߺ:i���W��a��>��b��ʭy��	Ȼ�ڡ�M/�v���D%�rD�M��Ԁ??H}�J���$
LS a�{��lЈ�j��'4�X�U3��`��:�'�3K�7f����/i�R�*$��<'S6��@Ww�7I��֠Oy��GJ�U�ux,a�,���Ҝ:b:�����!��~g)VXs��ں±�e8�:TF[����|m�!AwZ4[GS;R'��|�w�K('S; �7b��E�;DKV�X�B�(Q�����^���Q�ā�4\"έ��)��{�d@���}Qc,X_��H(D�A��*�R0U�K�\���	��>��:Y04�
�)� �D&$GIOt͕� ��E�ݙ�&U�Q	��9f��A!�]5z1G=QZ��I͖Vh�Z&\#��t����^Ҟw�;2ξv�~��4���$t\��mr�#3�~�    d���Ik!О�Ѽ�+3��Qd�@�'AD����]�����f�߾�Զ%�d�_ԏvm3s���_�����_}p�����*r�v�>�� -���Lzv��8s�Q�}f����:"Y�u�X�э7S���#���(4#>	��Ғ���J�<�W��D�V��m2��O.Em���␲սԑI~X��i�8�� �<FJOxNN��36JҜ^T�ҍ{�\p�{S�N� �}�_<7���S��U-��+��t�6ß\�|�*�8a�U����vEE(��\?�&qܡ��I�ȧFgO�S��=��zJ���&��S��q)֡Mt��9��u�#��t8ΧH=)�v�� L�w��1�u|�7����O�9{����
ЬO���Ϝy�7^(|~����>��6~��	�y�����{��~pR7SB�EYע.�-*3bd�iH->�	�mJ�����pf.SÜ�B����gΟ�f��j����xqe��%����oϮ\�7�K��|���L�*;���g�}�@�s>����W���U�CSh]�������l[VEFO3��[^�S�C ��FO���6�#�/��F�Z8e�21��`|��?�Lu�Ɦ�P���*�=,*�a8�O2ܿ��6z��d���2}�c�6g�e�����ūs.¿����:����[x!�/����;���n��s��>��>Ec�B�{��B+�a;����
����M�FR�ůgߘ���� L���S��^>W�=��^�0����?H�#��v�f��Q��b��]�+��T���:�݈��xv�������q��xz�|���F"H�x�X�H1C�U̾�8Q�q�
�Bm��"�-�vI#\�����tU4,����X����ʍK�9�,�_f(��sy��=/~��Ys��7
va��
�RvU�X?Us\`J��E��抬sO�P�G+*@�-���?�I8��K�z���D�؄�ܺ���4TZN�ާ(S�>��x_9�N�b�j?�b����HJr�2 ������Z��D���awR,c!+�=���V���"7t9hX���}K$�z��3o�BAR�yo?n�"'�i/ґ�(�fe�z�W]o�u��!E��e�㸅g��p͗�aP����4�,���6M�,�0��(��L�6=�]��i�9w���i�\l`��$��}���W����J{v�~s���7_���{���V&���iyQ΄�;S�=b�z�iK�t�Ճ�������~��^#���a<�
��P�p̛��G�I��;ͱ�ʳR���W��ᴠy�^�#�:��gˉ�}�hL1O!�;2�YG���LמyQ�l����~�b���!�Z2~6��A�j� �:}��J�*E0��/��
��Q6T���JRi�Z�&��XYQ��}���"�Ye�h3�%e�GٲRX���#[E�1-+���+Ǹ�����[��%��g�2��h$w�	
W�����h5{,9J��'8��q��yJ6rV����Pd�x����*�h�[�^�(���d]�~xN�)6��~I�ȩ7��i�o5��{����0�^���O�x�}�z�V�N8�E��7�ߜ.߼�vt��Zx�ݖ�{��/g{���8eQ�����(�{����6<�E��p:���7� 棩 ���,=���~���ۋ�+��_�[n�]?�HNBϝ��&��*!�{��E��&���3�%�m�m�����.�"�)���R��t``l�&���A)Ձ�-�������٢��#}���ɪ����4��~�q�˫觜
yd�ƾ4�ZI�W�9�w��7�Mb���'Ҽ�@*��$CJ�]�3�=myOQZ�d�N>�>4��J/a!�?�����6��U+@���)��c�	M�^s��7�̳���k��)�/i��{ܣ�-׍�A�ܸr��8���zy��Bt}%n�^m-��]Yh����Z���7a� �-�>�oz�}��ѷ54QT�eM�����X�/Q8�3������J�rd���k&�}X26�5��1��P<�y�k�*�\I0�I�푃�^0v�r��a9wp;�X�Z�W�aῤz��ᅯh?O>��>��_���W��'_#@}��>�
l����c�N�~�d�������AF����֎Έ��P���ݪ8%��+u ,�>F���vy�;'�Fn����= 
��eP�*L���Ӊ:��f.�?��l���=��˒�py��!�4�])�O��d������A"x��䛺��OE�� t�ȝi_n/��,_���2{������/ݜ����8���L?�l_Y��8s����{ǿ���{�(f��H(���$��ӂ`��NTeM���X퍛p&b�C��Ǳ?D�-�K�3�(�TGc���!`����rȣB��̊�T�Ɛ����|H9�QW���*��K��Ԛ8��I2�(�u����8n:�m d"G��żz��ڇ���ԅY��ү��n}U��GŐ���~�5���eg�Ri� SQ��S@�Hչv�3�%
��:�è\ț{�꜂4L	q�6�l�5,� ������I�����l��%<s��/�ۗT�F��^����o�o�k��K�Q���]JS9���1�NhQF����17R�q� O���	u�ߦ�3�̣�p�$�P��*_.*�L�Vb$�x�����M�<wf���@��k������s�;,u���lF� O�n#l���棩 ��;K_��$�;NDh�a���.O�mJ��`�����?p�8-8m����`�`�g�q�o:B��`��x �Y�0VX�Pქ.f���;���8�`h>�
Z�NE	;cB��������bP�@��&��#>|��:2P,S������l��,�R.,�(ſ�\�$�5���4}�t�h�XĤ�p�#�-�iF���/�h�ԣ�vخ;n� =S)�S�C�F��5��5=Ɇ{���0�����΍gM���Ez~=�t���Ғ����(��Tr��H4��'ru� 6w�y�����0Z�Uϙ@g� -�#$��ڤ�ު�jKO�Sdw�w�-82a�2:s�E`���kd��r�x�@f���PC!����G��t4�8]����Xے�E���g�VW��
�Iɽ/U�^d���d���~,�i�G��*!Ύ�'����둘�A���8��!"e��#̂��:��OUT´���+�&/��]ӦB����p �M'�Â�V��G6�^�ױ͡����,���l�8w��]Yz;�5��k��V��y?j��^z~ ����K�Cg-t�"{�y"�5�z?*��ƣ��}�ʫ���+r9�����~�ܿ�>g���N�v#A����s h���p�XP�omRCHK�s�n��@�z��;�W�\���}Jhw�����t�,Q��S��Ȓ�X��~N�M�$��4�:�/xq���A�wv�0}�'�R�̣WS����U��،��U�\����K�ǍR����!B���U�f�NZ"V*�Ǆ �wf��Z7o�޸�|�_Xh.�{=nߜ���B�z��;�����cݙ ��3�6�vb�9�'��`�q�]��:L�>�
=�'vDk��H���|D��E,`OJ�H�Y����ͬ6�x���4y��@ya�|��A?X��RU���O��t]��
��ōd�̌8�L �%oO�ZG��L]kg���r�����6�}>�q����ǿ��K�R�����k�Y�6ѧT>l��M���>�o>,d�N\n�(���A�&Fᅏ��<�b��]�*��q�obO�韫����Ar:��:=<�.R�ꤨ��AT� ���i�;�(T�L����	ve��x7=b��eTT'{fi�q��P�]�W�;�`D���xN�Յ.����,��]�iD��X>I�u@R �$5iZ����&���#9�Rh<(	� 	����>��I�tU酾qT�3�;W�|��C.�㍔J�Sg���Ӎ�;���N>W�!��Mc�Af�T)=�P2��Xi�J���͔��4S�s��ӫ��   ���3$����0{�1���@���C�5�ʍb�Ҵ�:�P�5]�O�\��	�L��ݢ�l�I�#�'�" S�AoS�k����'����;���捋�5���4�&NVr �HKiROR� O�1�k��E�SsB�ǎ���,�_����Ƣ���HMi��	��kUWXD?ǿk��r��q��o�ט��ʿ��:��q�jF3XZ_�v��ۗVۗ��f��2��E�}eW꠹>���@r*>4�	�˟v���:�GSo5����>-�      g      x������ � �      k      x������ � �      Y   �  x�u��n�@�����[�f����S� q+@A�(
��@�������^�^Z�4RDx��uH�GE;ڑf�O��Fڝ�{�E=� W�)�p�V$�	"������N/��^�+='z�gz�W8zx+_�?H���fا��$x3�x�h4,���ɴ_.���Y�Я�����wAq,�n9�F�z.�:�6%�e�<qf2+-UZ
*�������DA�t�B�7D��v�K4����ŕnK%S
��J2$��%��o>�/�����}3��g�'����]�j���cZ�BV��|�m�;�K�-���WV*��&���9����Q�|/M&�i1ʔ���2�b�������e|�n�N����+� ���k��O¯Q���8��?��'��x��
Ǜ~crFȨ����E�5ɕj����v������}�^�L�Nذ�僓L�γvH���nx&'́*%籽2N�a��e      m      x������ � �     