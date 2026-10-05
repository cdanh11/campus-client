// Generated from contracts/openapi.json; do not edit.
import type { LosslessNumber } from 'lossless-json'
export interface paths {
    "/api/v1/notifications/{id}/read": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: operations["read"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/event-registrations/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["own"];
        put: operations["change"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/users/{userId}/roles": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: operations["replaceRoles"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/students/{studentId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get"];
        put: operations["update"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/organization-units/{unitId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_1"];
        put: operations["update_1"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/notifications/templates/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["template"];
        put: operations["updateTemplate"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/notifications/notices/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["notice"];
        put: operations["edit"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/library/titles/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["title"];
        put: operations["updateTitle"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/library/loans/{id}/return": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: operations["returnBook"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/library/copies/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["copy"];
        put: operations["updateCopy"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/finance/payments/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_2"];
        /**
         * Reverse an entire receipt (administrative permission)
         * @description REVERSED is terminal; original amount/references remain immutable.
         */
        put: operations["reverse"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/finance/fees/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["fee"];
        put: operations["updateFee"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/finance/charges/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["charge"];
        /**
         * Cancel an obligation (administrative permission)
         * @description CANCELLED is terminal; financial snapshot is immutable.
         */
        put: operations["cancel"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/faculty-staff/{memberId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_3"];
        put: operations["update_2"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/events/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_4"];
        put: operations["update_3"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/event-registrations/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_5"];
        put: operations["change_1"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/dormitory/{resource}/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_6"];
        /**
         * Update Dormitory inventory (administrative permission)
         * @description expectedVersion required; parents immutable; deactivate active children before their parent.
         */
        put: operations["update_4"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/dormitory/assignments/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_7"];
        /**
         * Release accommodation (administrative permission)
         * @description RELEASED is terminal; expectedVersion required; references immutable.
         */
        put: operations["release"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/academic/terms/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_8"];
        /**
         * Update term (administrative permission)
         * @description Requires expectedVersion; stale version, invalid lifecycle or unavailable references return 409. Parent identifiers are immutable.
         */
        put: operations["update_5"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/academic/sections/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_9"];
        /**
         * Update section (administrative permission)
         * @description Requires expectedVersion; stale version, invalid lifecycle or unavailable references return 409. Parent identifiers are immutable.
         */
        put: operations["update_6"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/academic/programs/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_10"];
        /**
         * Update an academic program (administrative permission)
         * @description Requires expectedVersion from the last read; stale versions and duplicate codes return 409.
         */
        put: operations["update_7"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/academic/offerings/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_11"];
        /**
         * Update offering (administrative permission)
         * @description Requires expectedVersion; stale version, invalid lifecycle or unavailable references return 409. Parent identifiers are immutable.
         */
        put: operations["update_8"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/academic/enrollments/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_12"];
        /**
         * Withdraw or re-enroll (administrative permission)
         * @description Requires expectedVersion. Withdrawal releases capacity and is allowed after closure. Re-enrollment rechecks eligibility and capacity. Identifiers cannot change; repeating the current status returns 409.
         */
        put: operations["update_9"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/academic/courses/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_13"];
        /**
         * Update an academic course (administrative permission)
         * @description Requires expectedVersion from the last read; stale versions and duplicate codes return 409.
         */
        put: operations["update_10"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/events/{eventId}/registrations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["register"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["refresh"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["logout"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["login"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/users": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["search"];
        put?: never;
        post: operations["create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/users/{userId}/password-reset": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["resetPassword"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/students": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list"];
        put?: never;
        post: operations["create_1"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/organization-units": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_1"];
        put?: never;
        post: operations["create_2"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/notifications/templates": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["templates"];
        put?: never;
        post: operations["createTemplate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/notifications/notices": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["notices"];
        put?: never;
        post: operations["createNotice"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/notifications/notices/{id}/publish": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["publish"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/library/titles": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["titles"];
        put?: never;
        post: operations["createTitle"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/library/loans": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["loans"];
        put?: never;
        post: operations["borrow"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/library/copies": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["copies"];
        put?: never;
        post: operations["createCopy"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/finance/payments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_2"];
        put?: never;
        /** Record a manual VND payment (administrative permission) */
        post: operations["record"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/finance/fees": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["fees"];
        put?: never;
        /** Create a VND fee definition (administrative permission) */
        post: operations["createFee"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/finance/charges": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["charges"];
        put?: never;
        /** Create a Student obligation from an active fee snapshot (administrative permission) */
        post: operations["createCharge"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/faculty-staff": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_3"];
        put?: never;
        post: operations["create_3"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_4"];
        put?: never;
        post: operations["create_4"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/events/{eventId}/registrations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["register_1"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/dormitory/{resource}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_5"];
        put?: never;
        /**
         * Create Dormitory inventory (administrative permission)
         * @description ACTIVE initially; rooms/beds require immutable parentId and active ancestors.
         */
        post: operations["create_5"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/dormitory/assignments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_6"];
        put?: never;
        /** Assign a current bed (administrative permission) */
        post: operations["create_6"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/academic/terms": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Query terms (administrative permission)
         * @description Zero-based page; size 1–100; allowlisted field,asc/desc sort with ID tie-breaker.
         */
        get: operations["list_7"];
        put?: never;
        /**
         * Create term (administrative permission)
         * @description New resources start in PLANNED; lifecycle transitions require PUT and expectedVersion.
         */
        post: operations["create_7"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/academic/sections": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Query sections (administrative permission)
         * @description Zero-based page; size 1–100; allowlisted field,asc/desc sort with ID tie-breaker.
         */
        get: operations["list_8"];
        put?: never;
        /**
         * Create section (administrative permission)
         * @description New resources start in DRAFT; lifecycle transitions require PUT and expectedVersion.
         */
        post: operations["create_8"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/academic/programs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Search academic programs (administrative permission)
         * @description Zero-based page, size 1–100 (default 20), q up to 100 characters matched literally against code/name, optional ACTIVE/INACTIVE status; sort field,direction with id tie-breaker.
         */
        get: operations["list_9"];
        put?: never;
        /** Create an academic program (administrative permission) */
        post: operations["create_9"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/academic/offerings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Query offerings (administrative permission)
         * @description Zero-based page; size 1–100; allowlisted field,asc/desc sort with ID tie-breaker.
         */
        get: operations["list_10"];
        put?: never;
        /**
         * Create offering (administrative permission)
         * @description New resources start in DRAFT; lifecycle transitions require PUT and expectedVersion.
         */
        post: operations["create_10"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/academic/enrollments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Query enrollments (administrative permission)
         * @description Page >= 0, size 1–100; studentId/sectionId/status filters; status/createdAt/updatedAt sort with stable ID tie-breaker.
         */
        get: operations["list_11"];
        put?: never;
        /**
         * Enroll an active student (administrative permission)
         * @description Requires open section/offering, active term and available capacity. Duplicate membership returns 409; use PUT to re-enroll withdrawn membership.
         */
        post: operations["create_11"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/academic/courses": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Search academic courses (administrative permission)
         * @description Zero-based page, size 1–100 (default 20), q up to 100 characters matched literally against code/title, optional ACTIVE/INACTIVE status; sort field,direction with id tie-breaker.
         */
        get: operations["list_12"];
        put?: never;
        /** Create an academic course (administrative permission) */
        post: operations["create_12"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/users/{userId}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["changeStatus"];
        trace?: never;
    };
    "/api/v1/notifications": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["inbox"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/notifications/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["delivery"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_13"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/events/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_14"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/event-registrations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_14"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["me"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/users/{userId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_15"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/reports/{report}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_15"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/reports/{report}/export": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["export"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/reports/dashboard": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["dashboard"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/library/loans/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["loan"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/finance/charges/{id}/balance": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["balance"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/event-registrations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_16"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/audits/{source}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_17"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/audits/{source}/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_16"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        NotificationReadRequest: {
            /** Format: int64 */
            expectedVersion: number | bigint;
        };
        "com.campus.notification.domain.NotificationDelivery": {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            noticeId?: string;
            /** Format: uuid */
            recipientId?: string;
            /** @enum {string} */
            status?: "UNREAD" | "READ";
            /** Format: int64 */
            rowVersion?: number | bigint;
            /** Format: date-time */
            deliveredAt?: string;
            /** Format: date-time */
            readAt?: string;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        EventRegistrationChange: {
            /** @enum {string} */
            action: "CANCEL" | "RESTORE" | "ATTEND";
            /** Format: int64 */
            expectedVersion: number | bigint;
        };
        "com.campus.event.domain.EventRegistration": {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            eventId?: string;
            /** Format: uuid */
            studentId?: string;
            /** @enum {string} */
            status?: "REGISTERED" | "CANCELLED" | "ATTENDED";
            /** Format: int64 */
            rowVersion?: number | bigint;
            /** Format: date-time */
            registeredAt?: string;
            /** Format: date-time */
            cancelledAt?: string;
            /** Format: date-time */
            attendedAt?: string;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        "com.campus.identity.api.AdminUserController.RolesRequest": {
            roles: string[];
            /** Format: int64 */
            expectedVersion: number | bigint;
        };
        "com.campus.identity.api.AdminUserController.AdminUserResponse": {
            /** Format: uuid */
            id?: string;
            email?: string;
            displayName?: string;
            status?: string;
            roles?: string[];
            /** Format: int64 */
            securityVersion?: number | bigint;
            /** Format: int64 */
            rowVersion?: number | bigint;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        "com.campus.student.api.AdminStudentController.UpdateRequest": {
            studentNumber: string;
            fullName: string;
            email?: string;
            /** Format: uuid */
            identityUserId?: string;
            /** Format: uuid */
            organizationUnitId: string;
            /** @enum {string} */
            status: "ACTIVE" | "INACTIVE";
            /** Format: int64 */
            expectedVersion: number | bigint;
        };
        "com.campus.student.api.AdminStudentController.Response": {
            /** Format: uuid */
            id?: string;
            studentNumber?: string;
            fullName?: string;
            email?: string;
            /** Format: uuid */
            identityUserId?: string;
            /** Format: uuid */
            organizationUnitId?: string;
            status?: string;
            /** Format: int64 */
            rowVersion?: number | bigint;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        "com.campus.organization.api.AdminOrganizationUnitController.UpdateRequest": {
            code: string;
            name: string;
            /** @enum {string} */
            unitType: "FACULTY" | "DEPARTMENT" | "ADMINISTRATIVE";
            /** @enum {string} */
            status: "ACTIVE" | "INACTIVE";
            /** Format: int64 */
            expectedVersion: number | bigint;
        };
        "com.campus.organization.api.AdminOrganizationUnitController.Response": {
            /** Format: uuid */
            id?: string;
            code?: string;
            name?: string;
            unitType?: string;
            status?: string;
            /** Format: int64 */
            rowVersion?: number | bigint;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        NotificationTemplateUpdate: {
            code: string;
            name: string;
            title: string;
            body: string;
            /** @enum {string} */
            status: "ACTIVE" | "INACTIVE";
            /** Format: int64 */
            expectedVersion: number | bigint;
        };
        "com.campus.notification.domain.NotificationTemplate": {
            /** Format: uuid */
            id?: string;
            code?: string;
            name?: string;
            title?: string;
            body?: string;
            /** @enum {string} */
            status?: "ACTIVE" | "INACTIVE";
            /** Format: int64 */
            rowVersion?: number | bigint;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        NotificationNoticeEdit: {
            title: string;
            body: string;
            /** Format: int64 */
            expectedVersion: number | bigint;
        };
        "com.campus.notification.domain.Notice": {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            templateId?: string;
            title?: string;
            body?: string;
            /** @enum {string} */
            status?: "DRAFT" | "PUBLISHED";
            /** Format: int64 */
            rowVersion?: number | bigint;
            /** Format: date-time */
            publishedAt?: string;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        LibraryTitleUpdate: {
            code: string;
            title: string;
            author: string;
            /** @enum {string} */
            status: "ACTIVE" | "INACTIVE";
            /** Format: int64 */
            expectedVersion: number | bigint;
        };
        "com.campus.library.domain.BookTitle": {
            /** Format: uuid */
            id?: string;
            code?: string;
            title?: string;
            author?: string;
            /** @enum {string} */
            status?: "ACTIVE" | "INACTIVE";
            /** Format: int64 */
            rowVersion?: number | bigint;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        LibraryLoanReturn: {
            /** Format: int64 */
            expectedVersion: number | bigint;
        };
        "com.campus.library.domain.BookLoan": {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            copyId?: string;
            /** Format: uuid */
            studentId?: string;
            /** @enum {string} */
            status?: "OPEN" | "RETURNED";
            /** Format: int64 */
            rowVersion?: number | bigint;
            /** Format: date-time */
            borrowedAt?: string;
            /** Format: date-time */
            dueAt?: string;
            /** Format: date-time */
            returnedAt?: string;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        LibraryCopyUpdate: {
            code: string;
            /** @enum {string} */
            status: "ACTIVE" | "INACTIVE";
            /** Format: int64 */
            expectedVersion: number | bigint;
        };
        "com.campus.library.domain.BookCopy": {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            titleId?: string;
            code?: string;
            /** @enum {string} */
            status?: "ACTIVE" | "INACTIVE";
            /** Format: int64 */
            rowVersion?: number | bigint;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        FinancePaymentReverse: {
            /** @enum {string} */
            status: "RECORDED" | "REVERSED";
            /** Format: int64 */
            expectedVersion: number | bigint;
            /** Format: int64 */
            expectedChargeVersion: number | bigint;
            reason: string;
        };
        "com.campus.finance.domain.ManualPayment": {
            /** Format: uuid */
            id?: string;
            receiptNumber?: string;
            /** Format: uuid */
            chargeId?: string;
            amount?: number | bigint | LosslessNumber;
            currency?: string;
            /** @enum {string} */
            status?: "RECORDED" | "REVERSED";
            /** Format: int64 */
            rowVersion?: number | bigint;
            /** Format: date-time */
            recordedAt?: string;
            /** Format: date-time */
            reversedAt?: string;
            reversalReason?: string;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        FinanceFeeUpdate: {
            code: string;
            name: string;
            amount: number | bigint | LosslessNumber;
            /** @enum {string} */
            status: "ACTIVE" | "INACTIVE";
            /** Format: int64 */
            expectedVersion: number | bigint;
        };
        "com.campus.finance.domain.FeeDefinition": {
            /** Format: uuid */
            id?: string;
            code?: string;
            name?: string;
            amount?: number | bigint | LosslessNumber;
            currency?: string;
            /** @enum {string} */
            status?: "ACTIVE" | "INACTIVE";
            /** Format: int64 */
            rowVersion?: number | bigint;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        FinanceChargeCancel: {
            /** @enum {string} */
            status: "OPEN" | "CANCELLED";
            /** Format: int64 */
            expectedVersion: number | bigint;
        };
        "com.campus.finance.domain.StudentCharge": {
            /** Format: uuid */
            id?: string;
            chargeNumber?: string;
            /** Format: uuid */
            studentId?: string;
            /** Format: uuid */
            feeId?: string;
            feeCode?: string;
            feeName?: string;
            amount?: number | bigint | LosslessNumber;
            currency?: string;
            /** Format: date */
            dueDate?: string;
            /** @enum {string} */
            status?: "OPEN" | "CANCELLED";
            /** Format: int64 */
            rowVersion?: number | bigint;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        "com.campus.personnel.api.AdminFacultyStaffController.UpdateRequest": {
            personnelNumber: string;
            fullName: string;
            email?: string;
            /** Format: uuid */
            identityUserId?: string;
            /** @enum {string} */
            personnelType: "FACULTY" | "STAFF";
            /** Format: uuid */
            organizationUnitId: string;
            /** @enum {string} */
            status: "ACTIVE" | "INACTIVE";
            /** Format: int64 */
            expectedVersion: number | bigint;
        };
        "com.campus.personnel.api.AdminFacultyStaffController.Response": {
            /** Format: uuid */
            id?: string;
            personnelNumber?: string;
            fullName?: string;
            email?: string;
            /** Format: uuid */
            identityUserId?: string;
            personnelType?: string;
            /** Format: uuid */
            organizationUnitId?: string;
            status?: string;
            /** Format: int64 */
            rowVersion?: number | bigint;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        CampusEventUpdate: {
            code: string;
            title: string;
            description: string;
            /** Format: date-time */
            startsAt: string;
            /** Format: date-time */
            endsAt: string;
            /** Format: int32 */
            capacity: number;
            /** @enum {string} */
            status: "DRAFT" | "OPEN" | "CLOSED" | "CANCELLED";
            /** Format: int64 */
            expectedVersion: number | bigint;
        };
        "com.campus.event.domain.CampusEvent": {
            /** Format: uuid */
            id?: string;
            code?: string;
            title?: string;
            description?: string;
            /** Format: date-time */
            startsAt?: string;
            /** Format: date-time */
            endsAt?: string;
            /** Format: int32 */
            capacity?: number;
            /** @enum {string} */
            status?: "DRAFT" | "OPEN" | "CLOSED" | "CANCELLED";
            /** Format: int64 */
            rowVersion?: number | bigint;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        DormitoryInventoryUpdateRequest: {
            code: string;
            name: string;
            /** @enum {string} */
            status: "ACTIVE" | "INACTIVE";
            /** Format: int64 */
            expectedVersion: number | bigint;
        };
        "com.campus.dormitory.domain.InventoryItem": {
            /** Format: uuid */
            id?: string;
            /** @enum {string} */
            kind?: "BUILDING" | "ROOM" | "BED";
            /** Format: uuid */
            parentId?: string;
            code?: string;
            name?: string;
            /** @enum {string} */
            status?: "ACTIVE" | "INACTIVE";
            /** Format: int64 */
            rowVersion?: number | bigint;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        AccommodationAssignmentReleaseRequest: {
            /** @enum {string} */
            status: "ASSIGNED" | "RELEASED";
            /** Format: int64 */
            expectedVersion: number | bigint;
        };
        "com.campus.dormitory.domain.AccommodationAssignment": {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            studentId?: string;
            /** Format: uuid */
            bedId?: string;
            /** @enum {string} */
            status?: "ASSIGNED" | "RELEASED";
            /** Format: int64 */
            rowVersion?: number | bigint;
            /** Format: date-time */
            assignedAt?: string;
            /** Format: date-time */
            releasedAt?: string;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        "com.campus.academic.api.delivery.AdminAcademicTermController.UpdateRequest": {
            code: string;
            name: string;
            /** Format: date */
            startDate: string;
            /** Format: date */
            endDate: string;
            /** @enum {string} */
            status: "PLANNED" | "ACTIVE" | "CLOSED" | "CANCELLED";
            /** Format: int64 */
            expectedVersion: number | bigint;
        };
        "com.campus.academic.domain.AcademicTerm": {
            /** Format: uuid */
            id?: string;
            code?: string;
            name?: string;
            /** Format: date */
            startDate?: string;
            /** Format: date */
            endDate?: string;
            /** @enum {string} */
            status?: "PLANNED" | "ACTIVE" | "CLOSED" | "CANCELLED";
            /** Format: int64 */
            rowVersion?: number | bigint;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        "com.campus.academic.api.delivery.AdminClassSectionController.UpdateRequest": {
            code: string;
            /** Format: int32 */
            capacity?: number;
            /** Format: uuid */
            facultyId?: string;
            /** @enum {string} */
            status: "DRAFT" | "OPEN" | "CLOSED" | "CANCELLED";
            /** Format: int64 */
            expectedVersion: number | bigint;
        };
        "com.campus.academic.domain.ClassSection": {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            offeringId?: string;
            code?: string;
            /** Format: int32 */
            capacity?: number;
            /** Format: uuid */
            facultyId?: string;
            /** @enum {string} */
            status?: "DRAFT" | "OPEN" | "CLOSED" | "CANCELLED";
            /** Format: int64 */
            rowVersion?: number | bigint;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        "com.campus.academic.api.AdminAcademicProgramController.UpdateRequest": {
            code: string;
            name: string;
            /** Format: uuid */
            organizationUnitId: string;
            /** @enum {string} */
            status: "ACTIVE" | "INACTIVE";
            /** Format: int64 */
            expectedVersion: number | bigint;
        };
        "com.campus.academic.api.AdminAcademicProgramController.Response": {
            /** Format: uuid */
            id?: string;
            code?: string;
            name?: string;
            /** Format: uuid */
            organizationUnitId?: string;
            status?: string;
            /** Format: int64 */
            rowVersion?: number | bigint;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        "com.campus.academic.api.delivery.AdminCourseOfferingController.UpdateRequest": {
            /** @enum {string} */
            status: "DRAFT" | "OPEN" | "CLOSED" | "CANCELLED";
            /** Format: int64 */
            expectedVersion: number | bigint;
        };
        "com.campus.academic.domain.CourseOffering": {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            termId?: string;
            /** Format: uuid */
            courseId?: string;
            /** Format: uuid */
            organizationUnitId?: string;
            /** @enum {string} */
            status?: "DRAFT" | "OPEN" | "CLOSED" | "CANCELLED";
            /** Format: int64 */
            rowVersion?: number | bigint;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        "com.campus.academic.api.enrollment.AdminEnrollmentController.UpdateRequest": {
            /** @enum {string} */
            status: "ENROLLED" | "WITHDRAWN";
            /** Format: int64 */
            expectedVersion: number | bigint;
        };
        "com.campus.academic.domain.Enrollment": {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            studentId?: string;
            /** Format: uuid */
            sectionId?: string;
            /** @enum {string} */
            status?: "ENROLLED" | "WITHDRAWN";
            /** Format: int64 */
            rowVersion?: number | bigint;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        "com.campus.academic.api.AdminAcademicCourseController.UpdateRequest": {
            code: string;
            title: string;
            /** Format: int32 */
            credits: number;
            /** Format: uuid */
            organizationUnitId: string;
            /** @enum {string} */
            status: "ACTIVE" | "INACTIVE";
            /** Format: int64 */
            expectedVersion: number | bigint;
        };
        "com.campus.academic.api.AdminAcademicCourseController.Response": {
            /** Format: uuid */
            id?: string;
            code?: string;
            title?: string;
            /** Format: int32 */
            credits?: number;
            /** Format: uuid */
            organizationUnitId?: string;
            status?: string;
            /** Format: int64 */
            rowVersion?: number | bigint;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        "com.campus.identity.api.AuthController.RefreshResponse": {
            accessToken?: string;
            tokenType?: string;
            /** Format: int64 */
            expiresIn?: number | bigint;
        };
        "com.campus.identity.api.AuthController.LoginRequest": {
            email: string;
            password: string;
        };
        "com.campus.identity.api.AuthController.LoginResponse": {
            accessToken?: string;
            tokenType?: string;
            /** Format: int64 */
            expiresIn?: number | bigint;
            user?: components["schemas"]["com.campus.identity.api.AuthController.UserResponse"];
        };
        "com.campus.identity.api.AuthController.UserResponse": {
            /** Format: uuid */
            id?: string;
            email?: string;
            status?: string;
            roles?: string[];
        };
        "com.campus.identity.api.AdminUserController.CreateAdminUserRequest": {
            email: string;
            displayName: string;
            initialPassword: string;
            roles: string[];
            /** @enum {string} */
            status?: "ACTIVE" | "SUSPENDED" | "DISABLED";
        };
        "com.campus.identity.api.AdminUserController.PasswordResetRequest": {
            newPassword: string;
            /** Format: int64 */
            expectedVersion: number | bigint;
        };
        "com.campus.student.api.AdminStudentController.Request": {
            studentNumber: string;
            fullName: string;
            email?: string;
            /** Format: uuid */
            identityUserId?: string;
            /** Format: uuid */
            organizationUnitId: string;
            /** @enum {string} */
            status?: "ACTIVE" | "INACTIVE";
        };
        "com.campus.organization.api.AdminOrganizationUnitController.Request": {
            code: string;
            name: string;
            /** @enum {string} */
            unitType: "FACULTY" | "DEPARTMENT" | "ADMINISTRATIVE";
            /** @enum {string} */
            status?: "ACTIVE" | "INACTIVE";
        };
        NotificationTemplateCreate: {
            code: string;
            name: string;
            title: string;
            body: string;
        };
        NotificationNoticeCreate: {
            /** Format: uuid */
            templateId: string;
        };
        NotificationNoticePublish: {
            recipientIds: string[];
            /** Format: int64 */
            expectedVersion: number | bigint;
        };
        LibraryTitleCreate: {
            code: string;
            title: string;
            author: string;
        };
        LibraryLoanCreate: {
            /** Format: uuid */
            copyId: string;
            /** Format: uuid */
            studentId: string;
        };
        LibraryCopyCreate: {
            /** Format: uuid */
            titleId: string;
            code: string;
        };
        FinancePaymentCreate: {
            receiptNumber: string;
            /** Format: uuid */
            chargeId: string;
            amount: number | bigint | LosslessNumber;
            /** Format: int64 */
            expectedChargeVersion: number | bigint;
        };
        FinanceFeeCreate: {
            code: string;
            name: string;
            amount: number | bigint | LosslessNumber;
        };
        FinanceChargeCreate: {
            chargeNumber: string;
            /** Format: uuid */
            studentId: string;
            /** Format: uuid */
            feeId: string;
            /** Format: date */
            dueDate: string;
        };
        "com.campus.personnel.api.AdminFacultyStaffController.Request": {
            personnelNumber: string;
            fullName: string;
            email?: string;
            /** Format: uuid */
            identityUserId?: string;
            /** @enum {string} */
            personnelType: "FACULTY" | "STAFF";
            /** Format: uuid */
            organizationUnitId: string;
            /** @enum {string} */
            status?: "ACTIVE" | "INACTIVE";
        };
        CampusEventCreate: {
            code: string;
            title: string;
            description: string;
            /** Format: date-time */
            startsAt: string;
            /** Format: date-time */
            endsAt: string;
            /** Format: int32 */
            capacity: number;
        };
        EventRegistrationCreate: {
            /** Format: uuid */
            studentId: string;
        };
        DormitoryInventoryCreateRequest: {
            code: string;
            name: string;
            /** Format: uuid */
            parentId?: string;
        };
        AccommodationAssignmentCreateRequest: {
            /** Format: uuid */
            studentId: string;
            /** Format: uuid */
            bedId: string;
        };
        "com.campus.academic.api.delivery.AdminAcademicTermController.CreateRequest": {
            code: string;
            name: string;
            /** Format: date */
            startDate: string;
            /** Format: date */
            endDate: string;
        };
        "com.campus.academic.api.delivery.AdminClassSectionController.CreateRequest": {
            /** Format: uuid */
            offeringId: string;
            code: string;
            /** Format: int32 */
            capacity?: number;
            /** Format: uuid */
            facultyId?: string;
        };
        "com.campus.academic.api.AdminAcademicProgramController.Request": {
            code: string;
            name: string;
            /** Format: uuid */
            organizationUnitId: string;
            /** @enum {string} */
            status?: "ACTIVE" | "INACTIVE";
        };
        "com.campus.academic.api.delivery.AdminCourseOfferingController.CreateRequest": {
            /** Format: uuid */
            termId: string;
            /** Format: uuid */
            courseId: string;
        };
        "com.campus.academic.api.enrollment.AdminEnrollmentController.CreateRequest": {
            /** Format: uuid */
            studentId: string;
            /** Format: uuid */
            sectionId: string;
        };
        "com.campus.academic.api.AdminAcademicCourseController.Request": {
            code: string;
            title: string;
            /** Format: int32 */
            credits: number;
            /** Format: uuid */
            organizationUnitId: string;
            /** @enum {string} */
            status?: "ACTIVE" | "INACTIVE";
        };
        "com.campus.identity.api.AdminUserController.StatusRequest": {
            /** @enum {string} */
            status: "ACTIVE" | "SUSPENDED" | "DISABLED";
            /** Format: int64 */
            expectedVersion: number | bigint;
        };
        NotificationInboxPage: {
            content?: components["schemas"]["com.campus.notification.domain.InboxItem"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number | bigint;
            /** Format: int32 */
            totalPages?: number;
        };
        "com.campus.notification.domain.InboxItem": {
            delivery?: components["schemas"]["com.campus.notification.domain.NotificationDelivery"];
            title?: string;
            body?: string;
        };
        CampusEventPage: {
            content?: components["schemas"]["com.campus.event.domain.CampusEvent"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number | bigint;
            /** Format: int32 */
            totalPages?: number;
        };
        EventRegistrationPage: {
            content?: components["schemas"]["com.campus.event.domain.EventRegistration"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number | bigint;
            /** Format: int32 */
            totalPages?: number;
        };
        "com.campus.identity.api.AdminUserController.AdminUserPageResponse": {
            content?: components["schemas"]["com.campus.identity.api.AdminUserController.AdminUserResponse"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number | bigint;
            /** Format: int32 */
            totalPages?: number;
        };
        "com.campus.student.api.AdminStudentController.PageResponse": {
            content?: components["schemas"]["com.campus.student.api.AdminStudentController.Response"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number | bigint;
            /** Format: int32 */
            totalPages?: number;
        };
        "com.campus.reporting.application.DetailReportService.ReportPage": {
            /** @enum {string} */
            report?: "STUDENT_DEBT" | "CURRENT_ACCOMMODATION" | "SECTION_ENROLLMENT" | "EVENT_MEMBERSHIP" | "LIBRARY_LOANS";
            /** Format: date-time */
            asOf?: string;
            columns?: string[];
            content?: (components["schemas"]["com.campus.shared.application.reporting.ReportRow.Accommodation"] | components["schemas"]["com.campus.shared.application.reporting.ReportRow.Debt"] | components["schemas"]["com.campus.shared.application.reporting.ReportRow.Enrollment"] | components["schemas"]["com.campus.shared.application.reporting.ReportRow.Loan"] | components["schemas"]["com.campus.shared.application.reporting.ReportRow.Membership"])[];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number | bigint;
            /** Format: int64 */
            totalPages?: number | bigint;
        };
        "com.campus.shared.application.reporting.ReportRow": unknown;
        "com.campus.shared.application.reporting.ReportRow.Accommodation": components["schemas"]["com.campus.shared.application.reporting.ReportRow"] & {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            studentId?: string;
            /** Format: uuid */
            bedId?: string;
            /** Format: uuid */
            roomId?: string;
            /** Format: uuid */
            buildingId?: string;
            /** Format: date-time */
            assignedAt?: string;
        };
        "com.campus.shared.application.reporting.ReportRow.Debt": components["schemas"]["com.campus.shared.application.reporting.ReportRow"] & {
            /** Format: uuid */
            studentId?: string;
            /** Format: int64 */
            chargeCount?: number | bigint;
            principalVnd?: number | bigint | LosslessNumber;
            paidVnd?: number | bigint | LosslessNumber;
            outstandingVnd?: number | bigint | LosslessNumber;
        };
        "com.campus.shared.application.reporting.ReportRow.Enrollment": components["schemas"]["com.campus.shared.application.reporting.ReportRow"] & {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            studentId?: string;
            /** Format: uuid */
            sectionId?: string;
            /** Format: uuid */
            offeringId?: string;
            /** Format: uuid */
            termId?: string;
            /** Format: uuid */
            courseId?: string;
            status?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        "com.campus.shared.application.reporting.ReportRow.Loan": components["schemas"]["com.campus.shared.application.reporting.ReportRow"] & {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            studentId?: string;
            /** Format: uuid */
            copyId?: string;
            /** Format: uuid */
            titleId?: string;
            copyCode?: string;
            title?: string;
            /** Format: date-time */
            borrowedAt?: string;
            /** Format: date-time */
            dueAt?: string;
            overdue?: boolean;
        };
        "com.campus.shared.application.reporting.ReportRow.Membership": components["schemas"]["com.campus.shared.application.reporting.ReportRow"] & {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            eventId?: string;
            /** Format: uuid */
            studentId?: string;
            eventCode?: string;
            eventTitle?: string;
            status?: string;
            /** Format: date-time */
            registeredAt?: string;
            /** Format: date-time */
            cancelledAt?: string;
            /** Format: date-time */
            attendedAt?: string;
        };
        "com.campus.reporting.application.DashboardService.Dashboard": {
            /** Format: date-time */
            asOf?: string;
            currency?: string;
            groups?: {
                [key: string]: {
                    [key: string]: number | bigint | LosslessNumber;
                };
            };
        };
        "com.campus.organization.api.AdminOrganizationUnitController.PageResponse": {
            content?: components["schemas"]["com.campus.organization.api.AdminOrganizationUnitController.Response"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number | bigint;
            /** Format: int32 */
            totalPages?: number;
        };
        NotificationTemplatePage: {
            content?: components["schemas"]["com.campus.notification.domain.NotificationTemplate"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number | bigint;
            /** Format: int32 */
            totalPages?: number;
        };
        NotificationNoticePage: {
            content?: components["schemas"]["com.campus.notification.domain.Notice"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number | bigint;
            /** Format: int32 */
            totalPages?: number;
        };
        LibraryTitlePage: {
            content?: components["schemas"]["com.campus.library.domain.BookTitle"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number | bigint;
            /** Format: int32 */
            totalPages?: number;
        };
        LibraryLoanPage: {
            content?: components["schemas"]["com.campus.library.domain.BookLoan"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number | bigint;
            /** Format: int32 */
            totalPages?: number;
        };
        LibraryCopyPage: {
            content?: components["schemas"]["com.campus.library.domain.BookCopy"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number | bigint;
            /** Format: int32 */
            totalPages?: number;
        };
        FinancePaymentPage: {
            content?: components["schemas"]["com.campus.finance.domain.ManualPayment"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number | bigint;
            /** Format: int32 */
            totalPages?: number;
        };
        FinanceFeePage: {
            content?: components["schemas"]["com.campus.finance.domain.FeeDefinition"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number | bigint;
            /** Format: int32 */
            totalPages?: number;
        };
        FinanceChargePage: {
            content?: components["schemas"]["com.campus.finance.domain.StudentCharge"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number | bigint;
            /** Format: int32 */
            totalPages?: number;
        };
        "com.campus.finance.domain.ChargeBalance": {
            /** Format: uuid */
            chargeId?: string;
            amount?: number | bigint | LosslessNumber;
            currency?: string;
            /** @enum {string} */
            status?: "OPEN" | "CANCELLED";
            /** Format: int64 */
            rowVersion?: number | bigint;
            paidAmount?: number | bigint | LosslessNumber;
            outstandingAmount?: number | bigint | LosslessNumber;
        };
        "com.campus.personnel.api.AdminFacultyStaffController.PageResponse": {
            content?: components["schemas"]["com.campus.personnel.api.AdminFacultyStaffController.Response"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number | bigint;
            /** Format: int32 */
            totalPages?: number;
        };
        DormitoryInventoryPage: {
            content?: components["schemas"]["com.campus.dormitory.domain.InventoryItem"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number | bigint;
            /** Format: int32 */
            totalPages?: number;
        };
        AccommodationAssignmentPage: {
            content?: components["schemas"]["com.campus.dormitory.domain.AccommodationAssignment"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number | bigint;
            /** Format: int32 */
            totalPages?: number;
        };
        AuditViewingPage: {
            content?: components["schemas"]["com.campus.shared.application.audit.AuditView"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number | bigint;
            /** Format: int32 */
            totalPages?: number;
        };
        "com.campus.shared.application.audit.AuditView": {
            /** Format: uuid */
            id?: string;
            /** @enum {string} */
            source?: "IDENTITY" | "PEOPLE" | "ACADEMIC" | "DORMITORY" | "FINANCE" | "NOTIFICATION" | "EVENT" | "LIBRARY";
            resource?: string;
            /** Format: uuid */
            targetId?: string;
            /** Format: uuid */
            actorId?: string;
            action?: string;
            /** Format: int64 */
            resourceVersion?: number | bigint;
            /** Format: date-time */
            occurredAt?: string;
            metadata?: {
                [key: string]: string;
            };
        };
        "com.campus.academic.api.delivery.PageResponseCom.campus.academic.domain.AcademicTerm": {
            content?: components["schemas"]["com.campus.academic.domain.AcademicTerm"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number | bigint;
            /** Format: int32 */
            totalPages?: number;
        };
        "com.campus.academic.api.delivery.PageResponseCom.campus.academic.domain.ClassSection": {
            content?: components["schemas"]["com.campus.academic.domain.ClassSection"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number | bigint;
            /** Format: int32 */
            totalPages?: number;
        };
        "com.campus.academic.api.AdminAcademicProgramController.PageResponse": {
            content?: components["schemas"]["com.campus.academic.api.AdminAcademicProgramController.Response"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number | bigint;
            /** Format: int32 */
            totalPages?: number;
        };
        "com.campus.academic.api.delivery.PageResponseCom.campus.academic.domain.CourseOffering": {
            content?: components["schemas"]["com.campus.academic.domain.CourseOffering"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number | bigint;
            /** Format: int32 */
            totalPages?: number;
        };
        "com.campus.academic.api.delivery.PageResponseCom.campus.academic.domain.Enrollment": {
            content?: components["schemas"]["com.campus.academic.domain.Enrollment"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number | bigint;
            /** Format: int32 */
            totalPages?: number;
        };
        "com.campus.academic.api.AdminAcademicCourseController.PageResponse": {
            content?: components["schemas"]["com.campus.academic.api.AdminAcademicCourseController.Response"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number | bigint;
            /** Format: int32 */
            totalPages?: number;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    read: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["NotificationReadRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.notification.domain.NotificationDelivery"];
                };
            };
        };
    };
    own: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.event.domain.EventRegistration"];
                };
            };
        };
    };
    change: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EventRegistrationChange"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.event.domain.EventRegistration"];
                };
            };
        };
    };
    replaceRoles: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                userId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["com.campus.identity.api.AdminUserController.RolesRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.identity.api.AdminUserController.AdminUserResponse"];
                };
            };
        };
    };
    get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                studentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.student.api.AdminStudentController.Response"];
                };
            };
        };
    };
    update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                studentId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["com.campus.student.api.AdminStudentController.UpdateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.student.api.AdminStudentController.Response"];
                };
            };
        };
    };
    get_1: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                unitId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.organization.api.AdminOrganizationUnitController.Response"];
                };
            };
        };
    };
    update_1: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                unitId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["com.campus.organization.api.AdminOrganizationUnitController.UpdateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.organization.api.AdminOrganizationUnitController.Response"];
                };
            };
        };
    };
    template: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.notification.domain.NotificationTemplate"];
                };
            };
        };
    };
    updateTemplate: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["NotificationTemplateUpdate"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.notification.domain.NotificationTemplate"];
                };
            };
        };
    };
    notice: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.notification.domain.Notice"];
                };
            };
        };
    };
    edit: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["NotificationNoticeEdit"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.notification.domain.Notice"];
                };
            };
        };
    };
    title: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.library.domain.BookTitle"];
                };
            };
        };
    };
    updateTitle: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LibraryTitleUpdate"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.library.domain.BookTitle"];
                };
            };
        };
    };
    returnBook: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LibraryLoanReturn"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.library.domain.BookLoan"];
                };
            };
        };
    };
    copy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.library.domain.BookCopy"];
                };
            };
        };
    };
    updateCopy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LibraryCopyUpdate"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.library.domain.BookCopy"];
                };
            };
        };
    };
    get_2: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.finance.domain.ManualPayment"];
                };
            };
        };
    };
    reverse: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FinancePaymentReverse"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.finance.domain.ManualPayment"];
                };
            };
        };
    };
    fee: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.finance.domain.FeeDefinition"];
                };
            };
        };
    };
    updateFee: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FinanceFeeUpdate"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.finance.domain.FeeDefinition"];
                };
            };
        };
    };
    charge: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.finance.domain.StudentCharge"];
                };
            };
        };
    };
    cancel: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FinanceChargeCancel"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.finance.domain.StudentCharge"];
                };
            };
        };
    };
    get_3: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                memberId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.personnel.api.AdminFacultyStaffController.Response"];
                };
            };
        };
    };
    update_2: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                memberId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["com.campus.personnel.api.AdminFacultyStaffController.UpdateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.personnel.api.AdminFacultyStaffController.Response"];
                };
            };
        };
    };
    get_4: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.event.domain.CampusEvent"];
                };
            };
        };
    };
    update_3: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CampusEventUpdate"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.event.domain.CampusEvent"];
                };
            };
        };
    };
    get_5: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.event.domain.EventRegistration"];
                };
            };
        };
    };
    change_1: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EventRegistrationChange"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.event.domain.EventRegistration"];
                };
            };
        };
    };
    get_6: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                resource: string;
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.dormitory.domain.InventoryItem"];
                };
            };
        };
    };
    update_4: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                resource: string;
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DormitoryInventoryUpdateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.dormitory.domain.InventoryItem"];
                };
            };
        };
    };
    get_7: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.dormitory.domain.AccommodationAssignment"];
                };
            };
        };
    };
    release: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AccommodationAssignmentReleaseRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.dormitory.domain.AccommodationAssignment"];
                };
            };
        };
    };
    get_8: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.academic.domain.AcademicTerm"];
                };
            };
        };
    };
    update_5: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["com.campus.academic.api.delivery.AdminAcademicTermController.UpdateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.academic.domain.AcademicTerm"];
                };
            };
        };
    };
    get_9: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.academic.domain.ClassSection"];
                };
            };
        };
    };
    update_6: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["com.campus.academic.api.delivery.AdminClassSectionController.UpdateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.academic.domain.ClassSection"];
                };
            };
        };
    };
    get_10: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.academic.api.AdminAcademicProgramController.Response"];
                };
            };
        };
    };
    update_7: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["com.campus.academic.api.AdminAcademicProgramController.UpdateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.academic.api.AdminAcademicProgramController.Response"];
                };
            };
        };
    };
    get_11: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.academic.domain.CourseOffering"];
                };
            };
        };
    };
    update_8: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["com.campus.academic.api.delivery.AdminCourseOfferingController.UpdateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.academic.domain.CourseOffering"];
                };
            };
        };
    };
    get_12: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.academic.domain.Enrollment"];
                };
            };
        };
    };
    update_9: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["com.campus.academic.api.enrollment.AdminEnrollmentController.UpdateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.academic.domain.Enrollment"];
                };
            };
        };
    };
    get_13: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.academic.api.AdminAcademicCourseController.Response"];
                };
            };
        };
    };
    update_10: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["com.campus.academic.api.AdminAcademicCourseController.UpdateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.academic.api.AdminAcademicCourseController.Response"];
                };
            };
        };
    };
    register: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                eventId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.event.domain.EventRegistration"];
                };
            };
        };
    };
    refresh: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.identity.api.AuthController.RefreshResponse"];
                };
            };
        };
    };
    logout: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    login: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["com.campus.identity.api.AuthController.LoginRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.identity.api.AuthController.LoginResponse"];
                };
            };
        };
    };
    search: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
                q?: string;
                status?: string;
                role?: string;
                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.identity.api.AdminUserController.AdminUserPageResponse"];
                };
            };
        };
    };
    create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["com.campus.identity.api.AdminUserController.CreateAdminUserRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.identity.api.AdminUserController.AdminUserResponse"];
                };
            };
        };
    };
    resetPassword: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                userId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["com.campus.identity.api.AdminUserController.PasswordResetRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    list: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
                q?: string;
                status?: string;
                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.student.api.AdminStudentController.PageResponse"];
                };
            };
        };
    };
    create_1: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["com.campus.student.api.AdminStudentController.Request"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.student.api.AdminStudentController.Response"];
                };
            };
        };
    };
    list_1: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
                q?: string;
                status?: string;
                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.organization.api.AdminOrganizationUnitController.PageResponse"];
                };
            };
        };
    };
    create_2: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["com.campus.organization.api.AdminOrganizationUnitController.Request"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.organization.api.AdminOrganizationUnitController.Response"];
                };
            };
        };
    };
    templates: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
                q?: string;
                status?: string;
                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["NotificationTemplatePage"];
                };
            };
        };
    };
    createTemplate: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["NotificationTemplateCreate"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.notification.domain.NotificationTemplate"];
                };
            };
        };
    };
    notices: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
                q?: string;
                status?: string;
                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["NotificationNoticePage"];
                };
            };
        };
    };
    createNotice: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["NotificationNoticeCreate"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.notification.domain.Notice"];
                };
            };
        };
    };
    publish: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["NotificationNoticePublish"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.notification.domain.Notice"];
                };
            };
        };
    };
    titles: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
                q?: string;
                status?: string;
                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["LibraryTitlePage"];
                };
            };
        };
    };
    createTitle: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LibraryTitleCreate"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.library.domain.BookTitle"];
                };
            };
        };
    };
    loans: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
                copyId?: string;
                studentId?: string;
                status?: string;
                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["LibraryLoanPage"];
                };
            };
        };
    };
    borrow: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LibraryLoanCreate"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.library.domain.BookLoan"];
                };
            };
        };
    };
    copies: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
                q?: string;
                titleId?: string;
                status?: string;
                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["LibraryCopyPage"];
                };
            };
        };
    };
    createCopy: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LibraryCopyCreate"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.library.domain.BookCopy"];
                };
            };
        };
    };
    list_2: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
                q?: string;
                chargeId?: string;
                status?: string;
                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["FinancePaymentPage"];
                };
            };
        };
    };
    record: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FinancePaymentCreate"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.finance.domain.ManualPayment"];
                };
            };
        };
    };
    fees: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
                q?: string;
                status?: string;
                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["FinanceFeePage"];
                };
            };
        };
    };
    createFee: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FinanceFeeCreate"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.finance.domain.FeeDefinition"];
                };
            };
        };
    };
    charges: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
                q?: string;
                status?: string;
                studentId?: string;
                feeId?: string;
                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["FinanceChargePage"];
                };
            };
        };
    };
    createCharge: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FinanceChargeCreate"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.finance.domain.StudentCharge"];
                };
            };
        };
    };
    list_3: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
                q?: string;
                status?: string;
                personnelType?: string;
                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.personnel.api.AdminFacultyStaffController.PageResponse"];
                };
            };
        };
    };
    create_3: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["com.campus.personnel.api.AdminFacultyStaffController.Request"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.personnel.api.AdminFacultyStaffController.Response"];
                };
            };
        };
    };
    list_4: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
                q?: string;
                status?: string;
                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["CampusEventPage"];
                };
            };
        };
    };
    create_4: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CampusEventCreate"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.event.domain.CampusEvent"];
                };
            };
        };
    };
    register_1: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                eventId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EventRegistrationCreate"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.event.domain.EventRegistration"];
                };
            };
        };
    };
    list_5: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
                q?: string;
                status?: string;
                parentId?: string;
                sort?: string;
            };
            header?: never;
            path: {
                resource: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["DormitoryInventoryPage"];
                };
            };
        };
    };
    create_5: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                resource: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DormitoryInventoryCreateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.dormitory.domain.InventoryItem"];
                };
            };
        };
    };
    list_6: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
                studentId?: string;
                bedId?: string;
                status?: string;
                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["AccommodationAssignmentPage"];
                };
            };
        };
    };
    create_6: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AccommodationAssignmentCreateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.dormitory.domain.AccommodationAssignment"];
                };
            };
        };
    };
    list_7: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
                q?: string;
                status?: string;
                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.academic.api.delivery.PageResponseCom.campus.academic.domain.AcademicTerm"];
                };
            };
        };
    };
    create_7: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["com.campus.academic.api.delivery.AdminAcademicTermController.CreateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.academic.domain.AcademicTerm"];
                };
            };
        };
    };
    list_8: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
                q?: string;
                offeringId?: string;
                status?: string;
                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.academic.api.delivery.PageResponseCom.campus.academic.domain.ClassSection"];
                };
            };
        };
    };
    create_8: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["com.campus.academic.api.delivery.AdminClassSectionController.CreateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.academic.domain.ClassSection"];
                };
            };
        };
    };
    list_9: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
                q?: string;
                status?: string;
                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.academic.api.AdminAcademicProgramController.PageResponse"];
                };
            };
        };
    };
    create_9: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["com.campus.academic.api.AdminAcademicProgramController.Request"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.academic.api.AdminAcademicProgramController.Response"];
                };
            };
        };
    };
    list_10: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
                termId?: string;
                courseId?: string;
                status?: string;
                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.academic.api.delivery.PageResponseCom.campus.academic.domain.CourseOffering"];
                };
            };
        };
    };
    create_10: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["com.campus.academic.api.delivery.AdminCourseOfferingController.CreateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.academic.domain.CourseOffering"];
                };
            };
        };
    };
    list_11: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
                studentId?: string;
                sectionId?: string;
                status?: "ENROLLED" | "WITHDRAWN";
                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.academic.api.delivery.PageResponseCom.campus.academic.domain.Enrollment"];
                };
            };
        };
    };
    create_11: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["com.campus.academic.api.enrollment.AdminEnrollmentController.CreateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.academic.domain.Enrollment"];
                };
            };
        };
    };
    list_12: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
                q?: string;
                status?: string;
                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.academic.api.AdminAcademicCourseController.PageResponse"];
                };
            };
        };
    };
    create_12: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["com.campus.academic.api.AdminAcademicCourseController.Request"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.academic.api.AdminAcademicCourseController.Response"];
                };
            };
        };
    };
    changeStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                userId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["com.campus.identity.api.AdminUserController.StatusRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.identity.api.AdminUserController.AdminUserResponse"];
                };
            };
        };
    };
    inbox: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
                status?: string;
                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["NotificationInboxPage"];
                };
            };
        };
    };
    delivery: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.notification.domain.InboxItem"];
                };
            };
        };
    };
    list_13: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
                q?: string;
                status?: string;
                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["CampusEventPage"];
                };
            };
        };
    };
    get_14: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.event.domain.CampusEvent"];
                };
            };
        };
    };
    list_14: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
                eventId?: string;
                status?: string;
                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["EventRegistrationPage"];
                };
            };
        };
    };
    me: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.identity.api.AuthController.UserResponse"];
                };
            };
        };
    };
    get_15: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                userId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.identity.api.AdminUserController.AdminUserResponse"];
                };
            };
        };
    };
    list_15: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
                studentId?: string;
                resourceId?: string;
                status?: string;
                from?: string;
                until?: string;
                overdueOnly?: boolean;
                sort?: string;
            };
            header?: never;
            path: {
                report: "STUDENT_DEBT" | "CURRENT_ACCOMMODATION" | "SECTION_ENROLLMENT" | "EVENT_MEMBERSHIP" | "LIBRARY_LOANS";
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.reporting.application.DetailReportService.ReportPage"];
                };
            };
        };
    };
    export: {
        parameters: {
            query?: {
                studentId?: string;
                resourceId?: string;
                status?: string;
                from?: string;
                until?: string;
                overdueOnly?: boolean;
                sort?: string;
            };
            header?: never;
            path: {
                report: "STUDENT_DEBT" | "CURRENT_ACCOMMODATION" | "SECTION_ENROLLMENT" | "EVENT_MEMBERSHIP" | "LIBRARY_LOANS";
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": string;
                };
            };
        };
    };
    dashboard: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.reporting.application.DashboardService.Dashboard"];
                };
            };
        };
    };
    loan: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.library.domain.BookLoan"];
                };
            };
        };
    };
    balance: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.finance.domain.ChargeBalance"];
                };
            };
        };
    };
    list_16: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
                eventId?: string;
                studentId?: string;
                status?: string;
                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["EventRegistrationPage"];
                };
            };
        };
    };
    list_17: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
                targetId?: string;
                actorId?: string;
                resource?: string;
                action?: string;
                from?: string;
                until?: string;
                sort?: string;
            };
            header?: never;
            path: {
                source: "IDENTITY" | "PEOPLE" | "ACADEMIC" | "DORMITORY" | "FINANCE" | "NOTIFICATION" | "EVENT" | "LIBRARY";
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["AuditViewingPage"];
                };
            };
        };
    };
    get_16: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                source: "IDENTITY" | "PEOPLE" | "ACADEMIC" | "DORMITORY" | "FINANCE" | "NOTIFICATION" | "EVENT" | "LIBRARY";
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["com.campus.shared.application.audit.AuditView"];
                };
            };
        };
    };
}
