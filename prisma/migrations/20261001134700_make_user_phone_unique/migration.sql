-- CreateIndex
CREATE INDEX "course_purchase_request_phone_idx" ON "course_purchase_request"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_key" ON "user"("phone");

-- CreateIndex
CREATE INDEX "user_phone_idx" ON "user"("phone");
