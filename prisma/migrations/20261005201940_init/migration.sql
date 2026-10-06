-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'COACH', 'TRAINEE');

-- CreateEnum
CREATE TYPE "MetricUnit" AS ENUM ('REPS', 'TIME_SECONDS', 'DISTANCE_METERS', 'FREE_NUMBER');

-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('ACTIVE', 'ACHIEVED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainee_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "parentName" TEXT,
    "parentPhone" TEXT,
    "school" TEXT,
    "grade" TEXT,
    "bio" TEXT,
    "enlistmentGoal" TEXT,
    "yearImportance" TEXT,
    "strengths" TEXT,
    "weakness" TEXT,
    "importantToKnow" TEXT,
    "howFound" TEXT,
    "investmentLevel" TEXT,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "groupId" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trainee_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metric_definitions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" "MetricUnit" NOT NULL,
    "higherIsBetter" BOOLEAN NOT NULL DEFAULT true,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metric_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metric_entries" (
    "id" TEXT NOT NULL,
    "traineeId" TEXT NOT NULL,
    "metricId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enteredById" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metric_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goals" (
    "id" TEXT NOT NULL,
    "traineeId" TEXT NOT NULL,
    "metricId" TEXT NOT NULL,
    "targetValue" DOUBLE PRECISION NOT NULL,
    "targetDate" TIMESTAMP(3),
    "status" "GoalStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reflection_entries" (
    "id" TEXT NOT NULL,
    "traineeId" TEXT NOT NULL,
    "keepPoint" TEXT NOT NULL,
    "improvePoint" TEXT NOT NULL,
    "sessionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reflection_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coach_notes" (
    "id" TEXT NOT NULL,
    "traineeId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coach_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_programs" (
    "id" TEXT NOT NULL,
    "traineeId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'coming_soon',
    "content" JSONB,
    "generatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_programs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "trainee_profiles_userId_key" ON "trainee_profiles"("userId");

-- CreateIndex
CREATE INDEX "metric_entries_traineeId_metricId_idx" ON "metric_entries"("traineeId", "metricId");

-- CreateIndex
CREATE INDEX "goals_traineeId_metricId_idx" ON "goals"("traineeId", "metricId");

-- CreateIndex
CREATE INDEX "reflection_entries_traineeId_idx" ON "reflection_entries"("traineeId");

-- CreateIndex
CREATE INDEX "coach_notes_traineeId_idx" ON "coach_notes"("traineeId");

-- CreateIndex
CREATE UNIQUE INDEX "ai_programs_traineeId_key" ON "ai_programs"("traineeId");

-- AddForeignKey
ALTER TABLE "trainee_profiles" ADD CONSTRAINT "trainee_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainee_profiles" ADD CONSTRAINT "trainee_profiles_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metric_entries" ADD CONSTRAINT "metric_entries_traineeId_fkey" FOREIGN KEY ("traineeId") REFERENCES "trainee_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metric_entries" ADD CONSTRAINT "metric_entries_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "metric_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metric_entries" ADD CONSTRAINT "metric_entries_enteredById_fkey" FOREIGN KEY ("enteredById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_traineeId_fkey" FOREIGN KEY ("traineeId") REFERENCES "trainee_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "metric_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reflection_entries" ADD CONSTRAINT "reflection_entries_traineeId_fkey" FOREIGN KEY ("traineeId") REFERENCES "trainee_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_notes" ADD CONSTRAINT "coach_notes_traineeId_fkey" FOREIGN KEY ("traineeId") REFERENCES "trainee_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_notes" ADD CONSTRAINT "coach_notes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_programs" ADD CONSTRAINT "ai_programs_traineeId_fkey" FOREIGN KEY ("traineeId") REFERENCES "trainee_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
