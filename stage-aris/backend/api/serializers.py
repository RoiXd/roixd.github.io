from rest_framework import serializers

class QuestionSerializer(serializers.Serializer):
    question = serializers.CharField()
    response = serializers.CharField()

class CourseSerializer(serializers.Serializer):
    id = serializers.CharField(source='_id', read_only=True)
    name = serializers.CharField(max_length=200)
    description = serializers.CharField()
    questions = QuestionSerializer(many=True, required=False, default=list)

    def create(self, validated_data):
        from .db import get_db

        result = get_db().courses.insert_one(validated_data)
        validated_data['_id'] = str(result.inserted_id)
        return validated_data

    def update(self, instance, validated_data):
        from bson import ObjectId
        from .db import get_db

        get_db().courses.update_one(
            {'_id': ObjectId(instance['_id'])},
            {'$set': validated_data}
        )
        instance.update(validated_data)
        return instance
