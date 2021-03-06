<?php
/**
 *                  ___________       __            __
 *                  \__    ___/____ _/  |_ _____   |  |
 *                    |    |  /  _ \\   __\\__  \  |  |
 *                    |    | |  |_| ||  |   / __ \_|  |__
 *                    |____|  \____/ |__|  (____  /|____/
 *                                              \/
 *          ___          __                                   __
 *         |   |  ____ _/  |_   ____ _______   ____    ____ _/  |_
 *         |   | /    \\   __\_/ __ \\_  __ \ /    \ _/ __ \\   __\
 *         |   ||   |  \|  |  \  ___/ |  | \/|   |  \\  ___/ |  |
 *         |___||___|  /|__|   \_____>|__|   |___|  / \_____>|__|
 *                  \/                           \/
 *                  ________
 *                 /  _____/_______   ____   __ __ ______
 *                /   \  ___\_  __ \ /  _ \ |  |  \\____ \
 *                \    \_\  \|  | \/|  |_| ||  |  /|  |_| |
 *                 \______  /|__|    \____/ |____/ |   __/
 *                        \/                       |__|
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Creative Commons License.
 * It is available through the world-wide-web at this URL:
 * http://creativecommons.org/licenses/by-nc-nd/3.0/nl/deed.en_US
 * If you are unable to obtain it through the world-wide-web, please send an email
 * to servicedesk@tig.nl so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade this module to newer
 * versions in the future. If you wish to customize this module for your
 * needs please contact servicedesk@tig.nl for more information.
 *
 * @copyright   Copyright (c) Total Internet Group B.V. https://tig.nl/copyright
 * @license     http://creativecommons.org/licenses/by-nc-nd/3.0/nl/deed.en_US
 */
class TIG_PostNL_Model_Core_System_Config_Source_BirthdayCheckPakjegemakProductOptions
    extends TIG_PostNL_Model_Core_System_Config_Source_ProductOptions_Abstract
{
    /**
     * @var array
     */
    protected $_options = array(
        '3572' => array(
            'value'             => '3572',
            'label'             => 'Post Office + Birthday Check',
            'isExtraCover'      => false,
            'isAvond'           => true,
            'isSunday'          => true,
            'isCod'             => false,
            'isSameDay'         => true,
            'isPge'             => false,
            'statedAddressOnly' => false,
            'countryLimitation' => 'NL',
            'group'             => 'pakjegemak_options'
        ),
        '3575' => array(
            'value'             => '3575',
            'label'             => 'Post Office + Notification + Birthday Check',
            'isExtraCover'      => false,
            'isAvond'           => true,
            'isSunday'          => true,
            'isCod'             => false,
            'isSameDay'         => true,
            'isPge'             => true,
            'statedAddressOnly' => false,
            'countryLimitation' => 'NL',
            'group'             => 'pakjegemak_options'
        ),
        '3582' => array(
            'value'             => '3582',
            'label'             => 'Post Office + Extra Cover + Birthday Check',
            'isExtraCover'      => true,
            'isAvond'           => true,
            'isSunday'          => true,
            'isCod'             => false,
            'isSameDay'         => true,
            'isPge'             => false,
            'statedAddressOnly' => false,
            'countryLimitation' => 'NL',
            'group'             => 'pakjegemak_options'
        ),
        '3585' => array(
            'value'             => '3585',
            'label'             => 'Post Office + Extra Cover + Notification + Birthday Check',
            'isExtraCover'      => true,
            'isAvond'           => true,
            'isSunday'          => true,
            'isCod'             => false,
            'isSameDay'         => true,
            'isPge'             => true,
            'statedAddressOnly' => false,
            'countryLimitation' => 'NL',
            'group'             => 'pakjegemak_options'
        ),
    );

    /**
     * Get available id check options
     *
     * @param bool $flat
     *
     * @return array
     */
    public function getAvailableOptions($flat = false)
    {
        return $this->getOptions(array(), $flat, true);
    }
}
