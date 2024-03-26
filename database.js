Admin:{
    "table_name": "admin",
    "columns": [
        {
            "name": "id",
            "data_type": "varchar(36)",
            "collation": "utf8mb4_unicode_ci",
            "default": null,
            "null": true
        },
        {
            "name": "created_at",
            "data_type": "datetime",
            "collation": null,
            "default": "DEFAULT NULL",
            "null": true
        },
        {
            "name": "updated_at",
            "data_type": "datetime",
            "collation": null,
            "default": null,
            "null": false
        },
        {
            "name": "email",
            "data_type": "varchar(255)",
            "collation": "utf8mb4_unicode_ci",
            "default": null,
            "null": false
        },
        {
            "name": "login_attempt",
            "data_type": "int",
            "collation": null,
            "default": null,
            "null": false
        }
    ],
    "primary_key": "id"
}


User:{
    "table_name": "user",
    "columns": [
        {
            "name": "id",
            "data_type": "varchar(36)",
            "collation": "utf8mb4_unicode_ci",
            "default": null,
            "null": true
        },
        {
            "name": "created_at",
            "data_type": "datetime",
            "collation": null,
            "default": "DEFAULT NULL",
            "null": true
        },
        {
            "name": "updated_at",
            "data_type": "datetime",
            "collation": null,
            "default": null,
            "null": false
        },
        {
            "name": "name",
            "data_type": "varchar(255)",
            "collation": "utf8mb4_unicode_ci",
            "default": null,
            "null": false
        },
        {
            "name": "email",
            "data_type": "varchar(255)",
            "collation": "utf8mb4_unicode_ci",
            "default": null,
            "null": false
        },
        {
            "name": "address",
            "data_type": "varchar(255)",
            "collation": "utf8mb4_unicode_ci",
            "default": "DEFAULT NULL",
            "null": true
        },
        {
            "name": "password",
            "data_type": "varchar(255)",
            "collation": "utf8mb4_unicode_ci",
            "default": null,
            "null": false
        },
        {
            "name": "token",
            "data_type": "varchar(500)",
            "collation": "utf8mb4_unicode_ci",
            "default": "DEFAULT NULL",
            "null": true
        },
        {
            "name": "mobile_number",
            "data_type": "int",
            "collation": null,
            "default": "DEFAULT NULL",
            "null": true
        },
        {
            "name": "last_name",
            "data_type": "varchar(255)",
            "collation": "utf8mb4_unicode_ci",
            "default": "DEFAULT NULL",
            "null": true
        },
        {
            "name": "is_admin",
            "data_type": "tinyint(1)",
            "collation": null,
            "default": "'0'",
            "null": false
        },
        {
            "name": "about",
            "data_type": "varchar(1000)",
            "collation": "utf8mb4_unicode_ci",
            "default": "DEFAULT NULL",
            "null": true
        },
        {
            "name": "otp",
            "data_type": "int",
            "collation": null,
            "default": "DEFAULT NULL",
            "null": true
        }
    ],
    "primary_key": "id"
}

Course:{
    "table_name": "course",
    "columns": [
        {
            "name": "id",
            "data_type": "varchar(36)",
            "collation": "utf8mb4_unicode_ci",
            "default": null,
            "null": true
        },
        {
            "name": "created_at",
            "data_type": "datetime",
            "collation": null,
            "default": "DEFAULT NULL",
            "null": true
        },
        {
            "name": "updated_at",
            "data_type": "datetime",
            "collation": null,
            "default": null,
            "null": false
        },
        {
            "name": "course_name",
            "data_type": "varchar(255)",
            "collation": "utf8mb4_unicode_ci",
            "default": null,
            "null": false
        },
        {
            "name": "level",
            "data_type": "varchar(255)",
            "collation": "utf8mb4_unicode_ci",
            "default": null,
            "null": false
        },
        {
            "name": "department",
            "data_type": "varchar(255)",
            "collation": "utf8mb4_unicode_ci",
            "default": "DEFAULT NULL",
            "null": true
        },
        {
            "name": "prerequisites",
            "data_type": "json",
            "collation": null,
            "default": "DEFAULT NULL",
            "null": true
        }
    ],
    "primary_key": "id"
}

AdvisoryRecord:{
    "table_name": "advisoryrecord",
    "columns": [
        {
            "name": "id",
            "data_type": "varchar(36)",
            "collation": "utf8mb4_unicode_ci",
            "default": null,
            "null": true
        },
        {
            "name": "created_at",
            "data_type": "datetime",
            "collation": null,
            "default": "DEFAULT NULL",
            "null": true
        },
        {
            "name": "updated_at",
            "data_type": "datetime",
            "collation": null,
            "default": "DEFAULT NULL",
            "null": true
        },
        {
            "name": "term",
            "data_type": "varchar(255)",
            "collation": "utf8mb4_unicode_ci",
            "default": "DEFAULT NULL",
            "null": true
        },
        {
            "name": "status",
            "data_type": "varchar(255)",
            "collation": "utf8mb4_unicode_ci",
            "default": "DEFAULT NULL",
            "null": true
        },
        {
            "name": "gpa",
            "data_type": "varchar(255)",
            "collation": "utf8mb4_unicode_ci",
            "default": "DEFAULT NULL",
            "null": true
        },
        {
            "name": "last_term",
            "data_type": "varchar(255)",
            "collation": "utf8mb4_unicode_ci",
            "default": "DEFAULT NULL",
            "null": true
        },
        {
            "name": "courses",
            "data_type": "json",
            "collation": null,
            "default": "DEFAULT NULL",
            "null": true
        },
        {
            "name": "prerequisites",
            "data_type": "json",
            "collation": null,
            "default": "DEFAULT NULL",
            "null": true
        },
        {
            "name": "user_id",
            "data_type": "varchar(36)",
            "collation": "utf8mb4_unicode_ci",
            "default": "DEFAULT NULL",
            "null": true
        }
    ],
    "primary_key": "id",
    "foreign_keys": [
        {
            "name": "AdvisoryRecord_user_id_foreign",
            "column": "user_id",
            "references": {
                "table": "user",
                "column": "id"
            },
            "on_delete": "SET NULL",
            "on_update": "CASCADE"
        }
    ]
}
