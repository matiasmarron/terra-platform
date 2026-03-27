-- Trigger: auto-create a review_reward when a review is approved for the first time
CREATE OR REPLACE FUNCTION handle_review_approved()
RETURNS TRIGGER AS $$
BEGIN
  -- Only fire when is_approved transitions false → true
  IF (OLD.is_approved = false OR OLD.is_approved IS NULL) AND NEW.is_approved = true THEN
    INSERT INTO review_rewards (id, user_id, review_id, reward_type, reward_value, redeemed, created_at)
    VALUES (
      gen_random_uuid(),
      NEW.user_id,
      NEW.id,
      'premium_content',
      '30_days_free',
      false,
      now()
    )
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_review_approved ON reviews;
CREATE TRIGGER on_review_approved
  AFTER UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION handle_review_approved();
