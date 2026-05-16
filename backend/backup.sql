--
-- PostgreSQL database dump
--

\restrict 4zewEeZ4mIgVYEDMHcGqA2fhpQyga1FeAdFlWobyOM1E0gMxO68FVc5snYDxJlh

-- Dumped from database version 16.14 (Debian 16.14-1.pgdg13+1)
-- Dumped by pg_dump version 16.14 (Debian 16.14-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: driver_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.driver_permissions (
    id integer NOT NULL,
    driver_id integer NOT NULL,
    permission_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.driver_permissions OWNER TO postgres;

--
-- Name: driver_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.driver_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.driver_permissions_id_seq OWNER TO postgres;

--
-- Name: driver_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.driver_permissions_id_seq OWNED BY public.driver_permissions.id;


--
-- Name: drivers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.drivers (
    id integer NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    phone character varying(30),
    email character varying(255),
    license_number character varying(100) NOT NULL,
    license_category character varying(50) NOT NULL,
    medical_exam_valid_until date,
    status character varying(30) DEFAULT 'available'::character varying NOT NULL,
    user_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.drivers OWNER TO postgres;

--
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id integer NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(100) NOT NULL,
    category character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: service_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.service_records (
    id integer NOT NULL,
    vehicle_id integer NOT NULL,
    service_type character varying(100) NOT NULL,
    description text,
    service_date date NOT NULL,
    cost numeric(10,2) DEFAULT 0 NOT NULL,
    status character varying(30) DEFAULT 'planned'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.service_records OWNER TO postgres;

--
-- Name: trailers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trailers (
    id integer NOT NULL,
    registration_number character varying(30) NOT NULL,
    trailer_type character varying(50) NOT NULL,
    capacity_kg numeric(10,2) NOT NULL,
    volume_m3 numeric(10,2),
    status character varying(30) DEFAULT 'available'::character varying NOT NULL,
    inspection_valid_until date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.trailers OWNER TO postgres;

--
-- Name: transport_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transport_orders (
    id integer NOT NULL,
    order_number character varying(50) NOT NULL,
    client_name character varying(255) NOT NULL,
    pickup_location character varying(255) NOT NULL,
    delivery_location character varying(255) NOT NULL,
    cargo_weight_kg numeric(10,2) NOT NULL,
    cargo_type character varying(50),
    cargo_name character varying(255),
    planned_distance_km numeric(10,2),
    planned_duration_minutes integer,
    estimated_cost numeric(10,2),
    planned_date date NOT NULL,
    status character varying(30) DEFAULT 'new'::character varying NOT NULL,
    driver_id integer,
    vehicle_id integer,
    trailer_id integer,
    created_by_user_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.transport_orders OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    role_id integer NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: vehicles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicles (
    id integer NOT NULL,
    registration_number character varying(30) NOT NULL,
    brand character varying(100) NOT NULL,
    model character varying(100) NOT NULL,
    production_year integer NOT NULL,
    vehicle_type character varying(50) NOT NULL,
    capacity_kg numeric(10,2) DEFAULT 0 NOT NULL,
    mileage integer DEFAULT 0 NOT NULL,
    status character varying(30) DEFAULT 'available'::character varying NOT NULL,
    inspection_valid_until date,
    insurance_valid_until date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.vehicles OWNER TO postgres;

--
-- Name: driver_permissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_permissions ALTER COLUMN id SET DEFAULT nextval('public.driver_permissions_id_seq'::regclass);


--
-- Data for Name: driver_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.driver_permissions (id, driver_id, permission_id, created_at) FROM stdin;
1	1	1	2026-05-15 19:56:10.150877
2	1	3	2026-05-15 19:56:10.150877
3	2	1	2026-05-15 19:56:10.150877
4	2	5	2026-05-15 19:56:10.150877
5	3	1	2026-05-15 19:56:10.150877
6	3	6	2026-05-15 19:56:10.150877
7	4	1	2026-05-15 19:56:10.150877
8	4	7	2026-05-15 19:56:10.150877
9	4	3	2026-05-15 19:56:10.150877
10	5	8	2026-05-15 19:56:10.150877
11	5	1	2026-05-15 19:56:10.150877
12	6	1	2026-05-15 19:56:10.150877
13	6	4	2026-05-15 19:56:10.150877
14	6	2	2026-05-15 19:56:10.150877
15	7	1	2026-05-15 19:56:10.150877
16	7	7	2026-05-15 19:56:10.150877
17	8	1	2026-05-15 19:56:10.150877
18	8	8	2026-05-15 19:56:10.150877
19	9	1	2026-05-15 19:56:10.150877
20	9	3	2026-05-15 19:56:10.150877
21	10	1	2026-05-15 19:56:10.150877
22	10	4	2026-05-15 19:56:10.150877
23	10	2	2026-05-15 19:56:10.150877
24	11	1	2026-05-15 19:56:10.150877
25	11	5	2026-05-15 19:56:10.150877
26	12	1	2026-05-15 19:56:10.150877
27	12	6	2026-05-15 19:56:10.150877
28	13	1	2026-05-15 19:56:10.150877
29	13	7	2026-05-15 19:56:10.150877
30	14	1	2026-05-15 19:56:10.150877
31	14	8	2026-05-15 19:56:10.150877
32	15	1	2026-05-15 19:56:10.150877
33	15	3	2026-05-15 19:56:10.150877
34	16	1	2026-05-15 19:56:10.150877
35	16	4	2026-05-15 19:56:10.150877
36	16	2	2026-05-15 19:56:10.150877
37	17	1	2026-05-15 19:56:10.150877
38	17	5	2026-05-15 19:56:10.150877
39	18	1	2026-05-15 19:56:10.150877
40	18	6	2026-05-15 19:56:10.150877
41	19	1	2026-05-15 19:56:10.150877
42	19	7	2026-05-15 19:56:10.150877
43	20	1	2026-05-15 19:56:10.150877
44	20	8	2026-05-15 19:56:10.150877
45	21	1	2026-05-15 19:56:10.150877
46	21	3	2026-05-15 19:56:10.150877
47	22	1	2026-05-15 19:56:10.150877
48	22	4	2026-05-15 19:56:10.150877
49	22	2	2026-05-15 19:56:10.150877
50	23	1	2026-05-15 19:56:10.150877
51	23	5	2026-05-15 19:56:10.150877
52	24	1	2026-05-15 19:56:10.150877
53	24	6	2026-05-15 19:56:10.150877
54	25	1	2026-05-15 19:56:10.150877
55	25	7	2026-05-15 19:56:10.150877
56	26	1	2026-05-15 19:56:10.150877
57	26	8	2026-05-15 19:56:10.150877
58	27	1	2026-05-15 19:56:10.150877
59	27	3	2026-05-15 19:56:10.150877
60	28	1	2026-05-15 19:56:10.150877
61	28	4	2026-05-15 19:56:10.150877
62	28	2	2026-05-15 19:56:10.150877
63	29	1	2026-05-15 19:56:10.150877
64	29	5	2026-05-15 19:56:10.150877
65	30	1	2026-05-15 19:56:10.150877
66	30	6	2026-05-15 19:56:10.150877
67	31	1	2026-05-15 19:56:10.150877
68	31	7	2026-05-15 19:56:10.150877
69	32	1	2026-05-15 19:56:10.150877
70	32	8	2026-05-15 19:56:10.150877
71	33	1	2026-05-15 19:56:10.150877
72	33	3	2026-05-15 19:56:10.150877
73	34	1	2026-05-15 19:56:10.150877
74	34	4	2026-05-15 19:56:10.150877
75	34	2	2026-05-15 19:56:10.150877
76	35	1	2026-05-15 19:56:10.150877
77	35	5	2026-05-15 19:56:10.150877
78	36	1	2026-05-15 19:56:10.150877
79	36	6	2026-05-15 19:56:10.150877
80	37	1	2026-05-15 19:56:10.150877
81	37	7	2026-05-15 19:56:10.150877
82	38	1	2026-05-15 19:56:10.150877
83	38	8	2026-05-15 19:56:10.150877
84	39	1	2026-05-15 19:56:10.150877
85	39	3	2026-05-15 19:56:10.150877
86	40	1	2026-05-15 19:56:10.150877
87	40	4	2026-05-15 19:56:10.150877
88	40	2	2026-05-15 19:56:10.150877
89	41	1	2026-05-15 19:56:10.150877
90	41	5	2026-05-15 19:56:10.150877
91	42	1	2026-05-15 19:56:10.150877
92	42	6	2026-05-15 19:56:10.150877
93	43	1	2026-05-15 19:56:10.150877
94	43	7	2026-05-15 19:56:10.150877
95	44	1	2026-05-15 19:56:10.150877
96	44	8	2026-05-15 19:56:10.150877
97	45	1	2026-05-15 19:56:10.150877
98	45	3	2026-05-15 19:56:10.150877
99	46	1	2026-05-15 19:56:10.150877
100	46	4	2026-05-15 19:56:10.150877
101	46	2	2026-05-15 19:56:10.150877
102	47	1	2026-05-15 19:56:10.150877
103	47	5	2026-05-15 19:56:10.150877
104	48	1	2026-05-15 19:56:10.150877
105	48	6	2026-05-15 19:56:10.150877
106	49	1	2026-05-15 19:56:10.150877
107	49	7	2026-05-15 19:56:10.150877
108	50	1	2026-05-15 19:56:10.150877
109	50	8	2026-05-15 19:56:10.150877
110	51	1	2026-05-15 19:56:10.150877
111	51	3	2026-05-15 19:56:10.150877
112	52	1	2026-05-15 19:56:10.150877
113	52	4	2026-05-15 19:56:10.150877
114	52	2	2026-05-15 19:56:10.150877
115	53	1	2026-05-15 19:56:10.150877
116	53	5	2026-05-15 19:56:10.150877
117	54	1	2026-05-15 19:56:10.150877
118	54	6	2026-05-15 19:56:10.150877
119	55	1	2026-05-15 19:56:10.150877
120	55	7	2026-05-15 19:56:10.150877
121	56	1	2026-05-15 19:56:10.150877
122	56	8	2026-05-15 19:56:10.150877
123	57	1	2026-05-15 19:56:10.150877
124	57	3	2026-05-15 19:56:10.150877
125	58	1	2026-05-15 19:56:10.150877
126	58	4	2026-05-15 19:56:10.150877
127	58	2	2026-05-15 19:56:10.150877
128	59	1	2026-05-15 19:56:10.150877
129	59	5	2026-05-15 19:56:10.150877
130	60	1	2026-05-15 19:56:10.150877
131	60	6	2026-05-15 19:56:10.150877
132	61	1	2026-05-15 19:56:10.150877
133	61	7	2026-05-15 19:56:10.150877
134	62	1	2026-05-15 19:56:10.150877
135	62	8	2026-05-15 19:56:10.150877
136	63	1	2026-05-15 19:56:10.150877
137	63	3	2026-05-15 19:56:10.150877
\.


--
-- Data for Name: drivers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.drivers (id, first_name, last_name, phone, email, license_number, license_category, medical_exam_valid_until, status, user_id, created_at) FROM stdin;
1	Piotr	Nowak	600000001	piotr.nowak1@example.com	DRV1001	C+E	2027-06-06	in_route	3	2026-05-15 19:56:10.148798
2	Piotr	Nowak	600000002	piotr.nowak2@example.com	DRV1002	C+E	2027-06-11	in_route	4	2026-05-15 19:56:10.148798
3	Adam	Kowalski	600000003	adam.kowalski3@example.com	DRV1003	C+E	2027-06-16	in_route	5	2026-05-15 19:56:10.148798
4	Marcin	Wiśniewski	600000004	marcin.wisniewski4@example.com	DRV1004	C+E	2027-06-21	available	\N	2026-05-15 19:56:10.148798
5	Tomasz	Wójcik	600000005	tomasz.wojcik5@example.com	DRV1005	C+E	2027-06-26	in_route	6	2026-05-15 19:56:10.148798
6	Krzysztof	Kaczmarek	600000006	krzysztof.kaczmarek6@example.com	DRV1006	C+E	2027-07-01	in_route	7	2026-05-15 19:56:10.148798
7	Michał	Mazur	600000007	michal.mazur7@example.com	DRV1007	C+E	2027-07-06	available	\N	2026-05-15 19:56:10.148798
8	Paweł	Krawczyk	600000008	pawel.krawczyk8@example.com	DRV1008	C+E	2027-07-11	available	\N	2026-05-15 19:56:10.148798
9	Łukasz	Piotrowski	600000009	lukasz.piotrowski9@example.com	DRV1009	C+E	2027-07-16	available	\N	2026-05-15 19:56:10.148798
10	Sebastian	Grabowski	600000010	sebastian.grabowski10@example.com	DRV1010	C+E	2027-07-21	available	\N	2026-05-15 19:56:10.148798
11	Rafał	Zieliński	600000011	rafal.zielinski11@example.com	DRV1011	C+E	2027-07-26	available	\N	2026-05-15 19:56:10.148798
12	Damian	Szymański	600000012	damian.szymanski12@example.com	DRV1012	C+E	2027-07-31	unavailable	\N	2026-05-15 19:56:10.148798
13	Karol	Woźniak	600000013	karol.wozniak13@example.com	DRV1013	C+E	2027-08-05	available	\N	2026-05-15 19:56:10.148798
14	Adrian	Lis	600000014	adrian.lis14@example.com	DRV1014	C+E	2027-08-10	available	\N	2026-05-15 19:56:10.148798
15	Bartosz	Maj	600000015	bartosz.maj15@example.com	DRV1015	C+E	2027-08-15	available	\N	2026-05-15 19:56:10.148798
16	Cezary	Król	600000016	cezary.krol16@example.com	DRV1016	C+E	2027-08-20	available	\N	2026-05-15 19:56:10.148798
17	Daniel	Urban	600000017	daniel.urban17@example.com	DRV1017	C+E	2027-08-25	inactive	\N	2026-05-15 19:56:10.148798
18	Emil	Kurek	600000018	emil.kurek18@example.com	DRV1018	C+E	2027-08-30	available	\N	2026-05-15 19:56:10.148798
19	Filip	Bąk	600000019	filip.bak19@example.com	DRV1019	C+E	2027-09-04	available	\N	2026-05-15 19:56:10.148798
20	Grzegorz	Walczak	600000020	grzegorz.walczak20@example.com	DRV1020	C+E	2027-09-09	available	\N	2026-05-15 19:56:10.148798
21	Hubert	Czarnecki	600000021	hubert.czarnecki21@example.com	DRV1021	C+E	2027-09-14	available	\N	2026-05-15 19:56:10.148798
22	Igor	Sikora	600000022	igor.sikora22@example.com	DRV1022	C+E	2027-09-19	available	\N	2026-05-15 19:56:10.148798
23	Jakub	Baran	600000023	jakub.baran23@example.com	DRV1023	C+E	2027-09-24	available	\N	2026-05-15 19:56:10.148798
24	Kamil	Rybak	600000024	kamil.rybak24@example.com	DRV1024	C+E	2027-09-29	in_route	\N	2026-05-15 19:56:10.148798
25	Leon	Pawlak	600000025	leon.pawlak25@example.com	DRV1025	C+E	2027-10-04	available	\N	2026-05-15 19:56:10.148798
26	Marek	Głowacki	600000026	marek.glowacki26@example.com	DRV1026	C+E	2027-10-09	available	\N	2026-05-15 19:56:10.148798
27	Nikodem	Michalak	600000027	nikodem.michalak27@example.com	DRV1027	C+E	2027-10-14	available	\N	2026-05-15 19:56:10.148798
28	Oskar	Rutkowski	600000028	oskar.rutkowski28@example.com	DRV1028	C+E	2027-10-19	available	\N	2026-05-15 19:56:10.148798
29	Patryk	Jaworski	600000029	patryk.jaworski29@example.com	DRV1029	C+E	2027-10-24	available	\N	2026-05-15 19:56:10.148798
30	Radosław	Adamczyk	600000030	radoslaw.adamczyk30@example.com	DRV1030	C+E	2027-10-29	unavailable	\N	2026-05-15 19:56:10.148798
31	Szymon	Malinowski	600000031	szymon.malinowski31@example.com	DRV1031	C+E	2027-11-03	available	\N	2026-05-15 19:56:10.148798
32	Tadeusz	Dudek	600000032	tadeusz.dudek32@example.com	DRV1032	C+E	2027-11-08	available	\N	2026-05-15 19:56:10.148798
33	Wiktor	Włodarczyk	600000033	wiktor.wlodarczyk33@example.com	DRV1033	C+E	2027-11-13	available	\N	2026-05-15 19:56:10.148798
34	Aleksander	Kubiak	600000034	aleksander.kubiak34@example.com	DRV1034	C+E	2027-11-18	available	\N	2026-05-15 19:56:10.148798
35	Błażej	Mróz	600000035	blazej.mroz35@example.com	DRV1035	C+E	2027-11-23	inactive	\N	2026-05-15 19:56:10.148798
36	Cyprian	Zawadzki	600000036	cyprian.zawadzki36@example.com	DRV1036	C+E	2027-11-28	available	\N	2026-05-15 19:56:10.148798
37	Damian	Piasecki	600000037	damian.piasecki37@example.com	DRV1037	C+E	2027-12-03	available	\N	2026-05-15 19:56:10.148798
38	Edward	Kołodziej	600000038	edward.kolodziej38@example.com	DRV1038	C+E	2027-12-08	available	\N	2026-05-15 19:56:10.148798
39	Fabian	Tomczak	600000039	fabian.tomczak39@example.com	DRV1039	C+E	2027-12-13	available	\N	2026-05-15 19:56:10.148798
40	Gabriel	Kozłowski	600000040	gabriel.kozlowski40@example.com	DRV1040	C+E	2027-12-18	available	\N	2026-05-15 19:56:10.148798
41	Henryk	Kania	600000041	henryk.kania41@example.com	DRV1041	C+E	2027-12-23	available	\N	2026-05-15 19:56:10.148798
42	Ireneusz	Sobczak	600000042	ireneusz.sobczak42@example.com	DRV1042	C+E	2027-12-28	in_route	\N	2026-05-15 19:56:10.148798
43	Jerzy	Wilk	600000043	jerzy.wilk43@example.com	DRV1043	C+E	2028-01-02	available	\N	2026-05-15 19:56:10.148798
44	Konrad	Wieczorek	600000044	konrad.wieczorek44@example.com	DRV1044	C+E	2028-01-07	available	\N	2026-05-15 19:56:10.148798
45	Łukasz	Błaszczyk	600000045	lukasz.blaszczyk45@example.com	DRV1045	C+E	2028-01-12	available	\N	2026-05-15 19:56:10.148798
46	Mateusz	Bednarek	600000046	mateusz.bednarek46@example.com	DRV1046	C+E	2028-01-17	available	\N	2026-05-15 19:56:10.148798
47	Norbert	Sadowski	600000047	norbert.sadowski47@example.com	DRV1047	C+E	2028-01-22	available	\N	2026-05-15 19:56:10.148798
48	Olaf	Pietrzak	600000048	olaf.pietrzak48@example.com	DRV1048	C+E	2028-01-27	unavailable	\N	2026-05-15 19:56:10.148798
49	Przemysław	Marciniak	600000049	przemyslaw.marciniak49@example.com	DRV1049	C+E	2028-02-01	available	\N	2026-05-15 19:56:10.148798
50	Robert	Nowicki	600000050	robert.nowicki50@example.com	DRV1050	C+E	2028-02-06	available	\N	2026-05-15 19:56:10.148798
51	Sebastian	Kaczor	600000051	sebastian.kaczor51@example.com	DRV1051	C+E	2028-02-11	available	\N	2026-05-15 19:56:10.148798
52	Tomasz	Cieślak	600000052	tomasz.cieslak52@example.com	DRV1052	C+E	2028-02-16	available	\N	2026-05-15 19:56:10.148798
53	Wojciech	Laskowski	600000053	wojciech.laskowski53@example.com	DRV1053	C+E	2028-02-21	inactive	\N	2026-05-15 19:56:10.148798
54	Artur	Olszewski	600000054	artur.olszewski54@example.com	DRV1054	C+E	2028-02-26	available	\N	2026-05-15 19:56:10.148798
55	Bogdan	Jasiński	600000055	bogdan.jasinski55@example.com	DRV1055	C+E	2028-03-02	available	\N	2026-05-15 19:56:10.148798
56	Czesław	Kowalik	600000056	czeslaw.kowalik56@example.com	DRV1056	C+E	2028-03-07	available	\N	2026-05-15 19:56:10.148798
57	Dariusz	Kaczmarczyk	600000057	dariusz.kaczmarczyk57@example.com	DRV1057	C+E	2028-03-12	available	\N	2026-05-15 19:56:10.148798
58	Eryk	Kopeć	600000058	eryk.kopec58@example.com	DRV1058	C+E	2028-03-17	available	\N	2026-05-15 19:56:10.148798
59	Franciszek	Milewski	600000059	franciszek.milewski59@example.com	DRV1059	C+E	2028-03-22	available	\N	2026-05-15 19:56:10.148798
60	Gustaw	Wrona	600000060	gustaw.wrona60@example.com	DRV1060	C+E	2028-03-27	in_route	\N	2026-05-15 19:56:10.148798
61	Hieronim	Sroka	600000061	hieronim.sroka61@example.com	DRV1061	C+E	2028-04-01	available	\N	2026-05-15 19:56:10.148798
62	Ignacy	Borowski	600000062	ignacy.borowski62@example.com	DRV1062	C+E	2028-04-06	available	\N	2026-05-15 19:56:10.148798
63	Julian	Kamiński	600000063	julian.kaminski63@example.com	DRV1063	C+E	2028-04-11	available	\N	2026-05-15 19:56:10.148798
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (id, code, name, category, created_at) FROM stdin;
1	C_E	Prawo jazdy C+E	license	2026-05-15 19:56:10.150608
2	ADR	ADR	certificate	2026-05-15 19:56:10.150608
3	REFRIGERATED	Obsługa chłodni	specialization	2026-05-15 19:56:10.150608
4	TANKER	Obsługa cystern	specialization	2026-05-15 19:56:10.150608
5	CONTAINER	Obsługa kontenerów	specialization	2026-05-15 19:56:10.150608
6	DUMP	Obsługa wywrotek	specialization	2026-05-15 19:56:10.150608
7	CURTAIN	Obsługa naczep typu firanka	specialization	2026-05-15 19:56:10.150608
8	BOX	Obsługa naczep typu box	specialization	2026-05-15 19:56:10.150608
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name) FROM stdin;
1	admin
2	dispatcher
3	driver
\.


--
-- Data for Name: service_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.service_records (id, vehicle_id, service_type, description, service_date, cost, status, created_at) FROM stdin;
1	7	inspection	Przegląd okresowy ciągnika siodłowego	2026-03-15	1200.00	completed	2026-05-15 19:56:10.152597
2	9	oil_change	Wymiana oleju i filtrów	2026-04-12	850.00	completed	2026-05-15 19:56:10.152597
3	11	tires	Wymiana kompletu opon	2026-02-20	5600.00	completed	2026-05-15 19:56:10.152597
4	14	brakes	Serwis układu hamulcowego	2026-01-18	2300.00	completed	2026-05-15 19:56:10.152597
5	16	diagnostics	Diagnostyka komputerowa	2026-05-05	450.00	planned	2026-05-15 19:56:10.152597
\.


--
-- Data for Name: trailers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trailers (id, registration_number, trailer_type, capacity_kg, volume_m3, status, inspection_valid_until, created_at) FROM stdin;
1	RZT5001T	curtain	28000.00	90.00	available	2027-02-14	2026-05-15 19:56:10.150179
2	RZT5002T	refrigerated	24000.00	82.00	in_use	2027-02-27	2026-05-15 19:56:10.150179
3	RZT5003T	box	22000.00	78.00	in_use	2027-03-12	2026-05-15 19:56:10.150179
4	RZT5004T	tanker	30000.00	95.00	in_use	2027-03-25	2026-05-15 19:56:10.150179
5	RZT5005T	container	26000.00	88.00	in_use	2027-04-07	2026-05-15 19:56:10.150179
6	RZT5006T	dump	27000.00	60.00	in_use	2027-04-20	2026-05-15 19:56:10.150179
7	RZT5007T	curtain	28000.00	90.00	available	2027-05-03	2026-05-15 19:56:10.150179
8	RZT5008T	refrigerated	24000.00	82.00	inactive	2027-05-16	2026-05-15 19:56:10.150179
9	RZT5009T	box	22000.00	78.00	available	2027-05-29	2026-05-15 19:56:10.150179
10	RZT5010T	tanker	30000.00	95.00	available	2027-06-11	2026-05-15 19:56:10.150179
11	RZT5011T	container	26000.00	88.00	available	2027-06-24	2026-05-15 19:56:10.150179
12	RZT5012T	dump	27000.00	60.00	available	2027-07-07	2026-05-15 19:56:10.150179
13	RZT5013T	curtain	28000.00	90.00	available	2027-07-20	2026-05-15 19:56:10.150179
14	RZT5014T	refrigerated	24000.00	82.00	available	2027-08-02	2026-05-15 19:56:10.150179
15	RZT5015T	box	22000.00	78.00	in_use	2027-08-15	2026-05-15 19:56:10.150179
16	RZT5016T	tanker	30000.00	95.00	available	2027-08-28	2026-05-15 19:56:10.150179
17	RZT5017T	container	26000.00	88.00	available	2027-09-10	2026-05-15 19:56:10.150179
18	RZT5018T	dump	27000.00	60.00	available	2027-09-23	2026-05-15 19:56:10.150179
19	RZT5019T	curtain	28000.00	90.00	available	2027-10-06	2026-05-15 19:56:10.150179
20	RZT5020T	refrigerated	24000.00	82.00	available	2027-10-19	2026-05-15 19:56:10.150179
21	RZT5021T	box	22000.00	78.00	available	2027-11-01	2026-05-15 19:56:10.150179
22	RZT5022T	tanker	30000.00	95.00	in_service	2027-11-14	2026-05-15 19:56:10.150179
23	RZT5023T	container	26000.00	88.00	available	2027-11-27	2026-05-15 19:56:10.150179
24	RZT5024T	dump	27000.00	60.00	available	2027-12-10	2026-05-15 19:56:10.150179
25	RZT5025T	curtain	28000.00	90.00	available	2027-12-23	2026-05-15 19:56:10.150179
26	RZT5026T	refrigerated	24000.00	82.00	available	2028-01-05	2026-05-15 19:56:10.150179
27	RZT5027T	box	22000.00	78.00	available	2028-01-18	2026-05-15 19:56:10.150179
28	RZT5028T	tanker	30000.00	95.00	in_use	2028-01-31	2026-05-15 19:56:10.150179
29	RZT5029T	container	26000.00	88.00	available	2028-02-13	2026-05-15 19:56:10.150179
30	RZT5030T	dump	27000.00	60.00	inactive	2028-02-26	2026-05-15 19:56:10.150179
31	RZT5031T	curtain	28000.00	90.00	available	2028-03-10	2026-05-15 19:56:10.150179
32	RZT5032T	refrigerated	24000.00	82.00	available	2028-03-23	2026-05-15 19:56:10.150179
33	RZT5033T	box	22000.00	78.00	available	2028-04-05	2026-05-15 19:56:10.150179
34	RZT5034T	tanker	30000.00	95.00	in_use	2028-04-18	2026-05-15 19:56:10.150179
35	RZT5035T	container	26000.00	88.00	available	2028-05-01	2026-05-15 19:56:10.150179
36	RZT5036T	dump	27000.00	60.00	in_service	2028-05-14	2026-05-15 19:56:10.150179
37	RZT5037T	curtain	28000.00	90.00	available	2028-05-27	2026-05-15 19:56:10.150179
38	RZT5038T	refrigerated	24000.00	82.00	available	2028-06-09	2026-05-15 19:56:10.150179
39	RZT5039T	box	22000.00	78.00	available	2028-06-22	2026-05-15 19:56:10.150179
40	RZT5040T	tanker	30000.00	95.00	available	2028-07-05	2026-05-15 19:56:10.150179
41	RZT5041T	container	26000.00	88.00	available	2028-07-18	2026-05-15 19:56:10.150179
42	RZT5042T	dump	27000.00	60.00	available	2028-07-31	2026-05-15 19:56:10.150179
43	RZT5043T	curtain	28000.00	90.00	available	2028-08-13	2026-05-15 19:56:10.150179
44	RZT5044T	refrigerated	24000.00	82.00	available	2028-08-26	2026-05-15 19:56:10.150179
45	RZT5045T	box	22000.00	78.00	available	2028-09-08	2026-05-15 19:56:10.150179
46	RZT5046T	tanker	30000.00	95.00	available	2028-09-21	2026-05-15 19:56:10.150179
47	RZT5047T	container	26000.00	88.00	inactive	2028-10-04	2026-05-15 19:56:10.150179
48	RZT5048T	dump	27000.00	60.00	available	2028-10-17	2026-05-15 19:56:10.150179
49	RZT5049T	curtain	28000.00	90.00	available	2028-10-30	2026-05-15 19:56:10.150179
50	RZT5050T	refrigerated	24000.00	82.00	available	2028-11-12	2026-05-15 19:56:10.150179
\.


--
-- Data for Name: transport_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transport_orders (id, order_number, client_name, pickup_location, delivery_location, cargo_weight_kg, cargo_type, cargo_name, planned_distance_km, planned_duration_minutes, estimated_cost, planned_date, status, driver_id, vehicle_id, trailer_id, created_by_user_id, created_at) FROM stdin;
1	ZT-2026-001	Fresh Fruit Sp. z o.o.	Sandomierz	Warszawa	18000.00	food	jabłka	220.00	1440	2600.00	2026-05-30	planned	1	7	2	1	2026-05-15 19:56:10.151936
2	ZT-2026-002	Container Partner	Gdynia	Łódź	20000.00	containerized	kontener 40HC	360.00	1440	3200.00	2026-05-31	planned	2	9	5	1	2026-05-15 19:56:10.151936
3	ZT-2026-003	Build Stone	Kielce	Katowice	24000.00	aggregate	kruszywo	190.00	1440	2100.00	2026-06-01	planned	3	11	6	2	2026-05-15 19:56:10.151936
4	ZT-2026-004	Electro-Hurt	Rzeszów	Poznań	12000.00	electronics	laptopy	510.00	2880	3900.00	2026-06-02	in_progress	5	14	3	2	2026-05-15 19:56:10.151936
5	ZT-2026-005	Fuel-Trans	Płock	Rzeszów	22000.00	fuel	olej napędowy	410.00	2880	4700.00	2026-06-03	in_progress	6	16	4	1	2026-05-15 19:56:10.151936
6	ZT-2026-006	Retail Polska	Wrocław	Białystok	15000.00	general	towar mieszany	560.00	2880	3800.00	2026-06-04	new	13	18	7	1	2026-05-15 19:56:10.151936
7	ZT-2026-007	Parcel Group	Łódź	Lublin	9000.00	parcel	przesyłki kurierskie	290.00	1440	1800.00	2026-06-05	completed	8	19	9	2	2026-05-15 19:56:10.151936
8	ZT-2026-008	Frozen Cargo	Lublin	Gdańsk	14000.00	frozen	mrożonki	540.00	2880	4100.00	2026-06-06	cancelled	9	20	8	1	2026-05-15 19:56:10.151936
9	ZT-2026-009	Steel Logistic	Opole	Rzeszów	17000.00	general	profile stalowe	350.00	1440	2500.00	2026-06-07	new	19	21	13	2	2026-05-15 19:56:10.151936
10	ZT-2026-010	Med Pharma	Warszawa	Szczecin	11000.00	pharma	leki	610.00	2880	4700.00	2026-06-08	new	15	22	15	1	2026-05-15 19:56:10.151936
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, first_name, last_name, email, password_hash, role_id, is_active, created_at) FROM stdin;
1	Arek	Admin	arek@example.com	$2a$06$zaolT41CY4Nc83W8hsLL0.DBqziSeHG/nBuic7dn9guANucg1j2vq	1	t	2026-05-15 19:56:10.127982
2	Anna	Dispatcher	dispatcher@example.com	$2a$06$TBuP4gKRDdljMJOEqginNOWiOq8JMAsXU3mRoxPxZnO4cuKfW5s2u	2	t	2026-05-15 19:56:10.127982
3	Piotr	Nowak	piotr.nowak.driver@example.com	$2a$06$33l3zj1EYfcHHqIaBeQZNOPrHoIlF08QWS698Tw1fG2Qc1ezoAWBO	3	t	2026-05-15 19:56:10.127982
4	Piotr	Nowak	piotr.nowak.container@example.com	$2a$06$B5hH2/Y3tr7yKLm4HjZg3.8HVEt2TGRegoO4Ev22GOkjqLp7zlIrC	3	t	2026-05-15 19:56:10.127982
5	Adam	Kowalski	adam.kowalski.driver@example.com	$2a$06$BzSF1oQtikQh5oZpELuF7OK1GHdlLzdnoBhwrXKXqwgYaCldD1.Ma	3	t	2026-05-15 19:56:10.127982
6	Tomasz	Wojcik	tomasz.wojcik.driver@example.com	$2a$06$SX1z8ziR1lk8ooJm2cpNZOs.HR7g2sKg7fTdS72X6U6kFBPzajDNG	3	t	2026-05-15 19:56:10.127982
7	Krzysztof	Kaczmarek	krzysztof.kaczmarek.driver@example.com	$2a$06$mzeV/IL4ysmCdt11J2M/uegFznB/3oWLpgdTPtmiitcqu3Y3mTOxK	3	t	2026-05-15 19:56:10.127982
\.


--
-- Data for Name: vehicles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehicles (id, registration_number, brand, model, production_year, vehicle_type, capacity_kg, mileage, status, inspection_valid_until, insurance_valid_until, created_at) FROM stdin;
1	RZ1234A	Scania	R450	2021	truck	0.00	180000	available	2027-06-30	2027-12-31	2026-05-15 19:56:10.149645
2	RTA60234	Volvo	FH16	2016	truck	0.00	20222	available	2027-10-20	2027-12-29	2026-05-15 19:56:10.149645
3	KR5678B	Volvo	FH500	2020	truck	0.00	240000	available	2027-05-15	2027-11-30	2026-05-15 19:56:10.149645
4	LU9012C	MAN	TGX 18.510	2019	truck	0.00	320000	in_use	2026-10-20	2027-04-18	2026-05-15 19:56:10.149645
5	WA3456D	Mercedes-Benz	Actros 1845	2022	truck	0.00	95000	available	2028-01-10	2028-06-01	2026-05-15 19:56:10.149645
6	PO7890E	DAF	XF 480	2018	truck	0.00	410000	in_service	2026-08-14	2027-02-20	2026-05-15 19:56:10.149645
7	GD1122F	Renault	T High 480	2021	truck	0.00	150000	in_use	2027-09-01	2027-12-15	2026-05-15 19:56:10.149645
8	BI3344G	Iveco	S-Way 460	2020	truck	0.00	230000	inactive	2027-03-25	2027-10-05	2026-05-15 19:56:10.149645
9	KRA5566H	Scania	S500	2023	truck	0.00	60000	in_use	2028-07-20	2028-12-31	2026-05-15 19:56:10.149645
10	RZE7788I	Volvo	FH460	2019	truck	0.00	295000	available	2027-04-11	2027-08-19	2026-05-15 19:56:10.149645
11	RZA5011A	Scania	R450	2022	truck	0.00	127000	in_use	2027-07-07	2027-12-27	2026-05-15 19:56:10.149645
12	RZA5012A	Volvo	FH500	2023	truck	0.00	134000	available	2027-07-24	2028-01-15	2026-05-15 19:56:10.149645
13	RZA5013A	MAN	TGX 18.510	2024	truck	0.00	141000	available	2027-08-10	2028-02-03	2026-05-15 19:56:10.149645
14	RZA5014A	Mercedes-Benz	Actros 1845	2018	truck	0.00	148000	in_use	2027-08-27	2028-02-22	2026-05-15 19:56:10.149645
15	RZA5015A	DAF	XF 530	2019	truck	0.00	155000	in_service	2027-09-13	2028-03-12	2026-05-15 19:56:10.149645
16	RZA5016A	Renault	T High 480	2020	truck	0.00	162000	in_use	2027-09-30	2028-03-31	2026-05-15 19:56:10.149645
17	RZA5017A	Iveco	S-Way 460	2021	truck	0.00	169000	inactive	2027-10-17	2028-04-19	2026-05-15 19:56:10.149645
18	RZA5018A	Scania	S500	2022	truck	0.00	176000	available	2027-11-03	2028-05-08	2026-05-15 19:56:10.149645
19	RZA5019A	Volvo	FH460	2023	truck	0.00	183000	available	2027-11-20	2028-05-27	2026-05-15 19:56:10.149645
20	RZA5020A	Mercedes-Benz	Actros 1851	2024	truck	0.00	190000	available	2027-12-07	2028-06-15	2026-05-15 19:56:10.149645
21	RZA5021A	Scania	R450	2018	truck	0.00	197000	available	2027-12-24	2028-07-04	2026-05-15 19:56:10.149645
22	RZA5022A	Volvo	FH500	2019	truck	0.00	204000	available	2028-01-10	2028-07-23	2026-05-15 19:56:10.149645
23	RZA5023A	MAN	TGX 18.510	2020	truck	0.00	211000	available	2028-01-27	2028-08-11	2026-05-15 19:56:10.149645
24	RZA5024A	Mercedes-Benz	Actros 1845	2021	truck	0.00	218000	in_use	2028-02-13	2028-08-30	2026-05-15 19:56:10.149645
25	RZA5025A	DAF	XF 530	2022	truck	0.00	225000	in_service	2028-03-01	2028-09-18	2026-05-15 19:56:10.149645
26	RZA5026A	Renault	T High 480	2023	truck	0.00	232000	available	2028-03-18	2028-10-07	2026-05-15 19:56:10.149645
27	RZA5027A	Iveco	S-Way 460	2024	truck	0.00	239000	inactive	2028-04-04	2028-10-26	2026-05-15 19:56:10.149645
28	RZA5028A	Scania	S500	2018	truck	0.00	246000	available	2028-04-21	2028-11-14	2026-05-15 19:56:10.149645
29	RZA5029A	Volvo	FH460	2019	truck	0.00	253000	available	2028-05-08	2028-12-03	2026-05-15 19:56:10.149645
30	RZA5030A	Mercedes-Benz	Actros 1851	2020	truck	0.00	260000	available	2028-05-25	2028-12-22	2026-05-15 19:56:10.149645
31	RZA5031A	Scania	R450	2021	truck	0.00	267000	available	2028-06-11	2029-01-10	2026-05-15 19:56:10.149645
32	RZA5032A	Volvo	FH500	2022	truck	0.00	274000	available	2028-06-28	2029-01-29	2026-05-15 19:56:10.149645
33	RZA5033A	MAN	TGX 18.510	2023	truck	0.00	281000	available	2028-07-15	2029-02-17	2026-05-15 19:56:10.149645
34	RZA5034A	Mercedes-Benz	Actros 1845	2024	truck	0.00	288000	in_use	2028-08-01	2029-03-08	2026-05-15 19:56:10.149645
35	RZA5035A	DAF	XF 530	2018	truck	0.00	295000	in_service	2028-08-18	2029-03-27	2026-05-15 19:56:10.149645
36	RZA5036A	Renault	T High 480	2019	truck	0.00	302000	available	2028-09-04	2029-04-15	2026-05-15 19:56:10.149645
37	RZA5037A	Iveco	S-Way 460	2020	truck	0.00	309000	inactive	2028-09-21	2029-05-04	2026-05-15 19:56:10.149645
38	RZA5038A	Scania	S500	2021	truck	0.00	316000	available	2028-10-08	2029-05-23	2026-05-15 19:56:10.149645
39	RZA5039A	Volvo	FH460	2022	truck	0.00	323000	available	2028-10-25	2029-06-11	2026-05-15 19:56:10.149645
40	RZA5040A	Mercedes-Benz	Actros 1851	2023	truck	0.00	330000	available	2028-11-11	2029-06-30	2026-05-15 19:56:10.149645
41	RZA5041A	Scania	R450	2024	truck	0.00	337000	available	2028-11-28	2029-07-19	2026-05-15 19:56:10.149645
42	RZA5042A	Volvo	FH500	2018	truck	0.00	344000	available	2028-12-15	2029-08-07	2026-05-15 19:56:10.149645
43	RZA5043A	MAN	TGX 18.510	2019	truck	0.00	351000	available	2029-01-01	2029-08-26	2026-05-15 19:56:10.149645
44	RZA5044A	Mercedes-Benz	Actros 1845	2020	truck	0.00	358000	in_use	2029-01-18	2029-09-14	2026-05-15 19:56:10.149645
45	RZA5045A	DAF	XF 530	2021	truck	0.00	365000	in_service	2029-02-04	2029-10-03	2026-05-15 19:56:10.149645
46	RZA5046A	Renault	T High 480	2022	truck	0.00	372000	available	2029-02-21	2029-10-22	2026-05-15 19:56:10.149645
47	RZA5047A	Iveco	S-Way 460	2023	truck	0.00	379000	inactive	2029-03-10	2029-11-10	2026-05-15 19:56:10.149645
48	RZA5048A	Scania	S500	2024	truck	0.00	386000	available	2029-03-27	2029-11-29	2026-05-15 19:56:10.149645
49	RZA5049A	Volvo	FH460	2018	truck	0.00	393000	available	2029-04-13	2029-12-18	2026-05-15 19:56:10.149645
50	RZA5050A	Mercedes-Benz	Actros 1851	2019	truck	0.00	400000	available	2029-04-30	2030-01-06	2026-05-15 19:56:10.149645
\.


--
-- Name: driver_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.driver_permissions_id_seq', 137, true);


--
-- Name: driver_permissions driver_permissions_driver_id_permission_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_permissions
    ADD CONSTRAINT driver_permissions_driver_id_permission_id_key UNIQUE (driver_id, permission_id);


--
-- Name: driver_permissions driver_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_permissions
    ADD CONSTRAINT driver_permissions_pkey PRIMARY KEY (id);


--
-- Name: drivers drivers_license_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_license_number_key UNIQUE (license_number);


--
-- Name: drivers drivers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_pkey PRIMARY KEY (id);


--
-- Name: drivers drivers_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_user_id_key UNIQUE (user_id);


--
-- Name: permissions permissions_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_code_key UNIQUE (code);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: service_records service_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_records
    ADD CONSTRAINT service_records_pkey PRIMARY KEY (id);


--
-- Name: trailers trailers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trailers
    ADD CONSTRAINT trailers_pkey PRIMARY KEY (id);


--
-- Name: trailers trailers_registration_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trailers
    ADD CONSTRAINT trailers_registration_number_key UNIQUE (registration_number);


--
-- Name: transport_orders transport_orders_order_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transport_orders
    ADD CONSTRAINT transport_orders_order_number_key UNIQUE (order_number);


--
-- Name: transport_orders transport_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transport_orders
    ADD CONSTRAINT transport_orders_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vehicles vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_pkey PRIMARY KEY (id);


--
-- Name: vehicles vehicles_registration_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_registration_number_key UNIQUE (registration_number);


--
-- Name: ux_transport_orders_active_driver; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ux_transport_orders_active_driver ON public.transport_orders USING btree (driver_id) WHERE ((driver_id IS NOT NULL) AND ((status)::text = ANY ((ARRAY['planned'::character varying, 'in_progress'::character varying])::text[])));


--
-- Name: ux_transport_orders_active_trailer; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ux_transport_orders_active_trailer ON public.transport_orders USING btree (trailer_id) WHERE ((trailer_id IS NOT NULL) AND ((status)::text = ANY ((ARRAY['planned'::character varying, 'in_progress'::character varying])::text[])));


--
-- Name: ux_transport_orders_active_vehicle; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ux_transport_orders_active_vehicle ON public.transport_orders USING btree (vehicle_id) WHERE ((vehicle_id IS NOT NULL) AND ((status)::text = ANY ((ARRAY['planned'::character varying, 'in_progress'::character varying])::text[])));


--
-- Name: driver_permissions driver_permissions_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_permissions
    ADD CONSTRAINT driver_permissions_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id) ON DELETE CASCADE;


--
-- Name: driver_permissions driver_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_permissions
    ADD CONSTRAINT driver_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- Name: drivers drivers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: service_records service_records_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_records
    ADD CONSTRAINT service_records_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE CASCADE;


--
-- Name: transport_orders transport_orders_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transport_orders
    ADD CONSTRAINT transport_orders_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: transport_orders transport_orders_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transport_orders
    ADD CONSTRAINT transport_orders_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id);


--
-- Name: transport_orders transport_orders_trailer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transport_orders
    ADD CONSTRAINT transport_orders_trailer_id_fkey FOREIGN KEY (trailer_id) REFERENCES public.trailers(id);


--
-- Name: transport_orders transport_orders_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transport_orders
    ADD CONSTRAINT transport_orders_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id);


--
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- PostgreSQL database dump complete
--

\unrestrict 4zewEeZ4mIgVYEDMHcGqA2fhpQyga1FeAdFlWobyOM1E0gMxO68FVc5snYDxJlh

