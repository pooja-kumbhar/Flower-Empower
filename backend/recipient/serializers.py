from rest_framework import serializers
from .models import Recipient
import requests


class RecipientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipient
        fields = ['id', 'first_name', 'last_name', 'address', 'city', 'state', 'zip', 'end_date', 'group', 'lon', 'lat']

    def create(self, validated_data):
        address = validated_data.get('address')
        city = validated_data.get('city')
        state = validated_data.get('state')
        zip = validated_data.get('zip')

        address_string = str(f'{address}, {city}, {state}, {zip}')

        api_response = self.api_call(address_string)

        response_results = api_response['results']

        result_object = response_results[0]

        validated_data['lon'] = result_object['lon']
        validated_data['lat'] = result_object['lat']

        return super().create(validated_data)

    def update(self, instance, validated_data):
        address = validated_data.get('address', instance.address)
        city = validated_data.get('city', instance.city)
        state = validated_data.get('state', instance.state)
        zip = validated_data.get('zip', instance.zip)

        if any([address != instance.address, city != instance.city, state != instance.state, zip != instance.zip]):
            address_string = str(f'{address}, {city}, {state}, {zip}')
            api_response = self.api_call(address_string)

            response_results = api_response['results']
            result_object = response_results[0]

            validated_data['lon'] = result_object['lon']
            validated_data['lat'] = result_object['lat']

        return super().update(instance, validated_data)

    def api_call(self, address_string):
        apiKey = '33a37056031e4222b3e9b659704ea36f'
        url = f'https://api.geoapify.com/v1/geocode/search?&apiKey={apiKey}&text={address_string}&format=json'
        headers = {'Content-Type': 'application/json'}
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            raise serializers.ValidationError('API Call failed')
