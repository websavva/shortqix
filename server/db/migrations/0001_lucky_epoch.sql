CREATE TABLE "error_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(100) NOT NULL,
	"message" varchar(20000) NOT NULL,
	"stack" text,
	"user_id" integer,
	"user_agent" varchar(10000),
	"user_agent_info" text,
	"ip" "inet",
	"ip_info" text,
	"url" varchar(30000),
	"timestamp" timestamp DEFAULT now(),
	"env" varchar(100) NOT NULL
);
